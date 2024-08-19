using Fanex.Data.Repository;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Services.SendDataOic;

public interface InsertToAmendmentTableStage
{
    Task<IEnumerable<LicenseeFile>> Execute(ExcelOicModel ticketsJson, SendFileQuery sendFileQuery);
}

public class InsertToAmendmentTableStageImp : InsertToAmendmentTableStage
{
    private readonly IDynamicRepository repository;
    private readonly LoggingService loggingService;

    public InsertToAmendmentTableStageImp(IDynamicRepository repository, LoggingService loggingService)
    {
        this.repository = repository;
        this.loggingService = loggingService;
    }

    public async Task<IEnumerable<LicenseeFile>> Execute(ExcelOicModel ticketsJson, SendFileQuery sendFileQuery)
    {
        var insertedResults = await InsertToMainDb052(ticketsJson, sendFileQuery);
        await InsertToBackupDb053(ticketsJson, sendFileQuery);
        return insertedResults;
    }

    private async Task<IEnumerable<LicenseeFile>> InsertToMainDb052(ExcelOicModel ticketsJson, SendFileQuery sendFileQuery)
    {
        var criteria = new SendDataOicCriteria
        {
            GlobalShowTime = sendFileQuery.GlobalShowTime.ZoneCanada(),
            MatchId = sendFileQuery.MatchId,
            TransInfoSendOICJson = ticketsJson.TransInfoSendOICJson
        };

        return await repository.FetchAsync<LicenseeFile>(criteria);
    }

    private async Task InsertToBackupDb053(ExcelOicModel ticketsJson, SendFileQuery sendFileQuery)
    {
        try
        {
            var isEnvHasBackupDb = AppSettingService.AppSetting.EnvironmentName is "SIT" or "UAT" or "PRO" or "KLDR";
            if (isEnvHasBackupDb)
            {
                await ExecuteRepositoryInsertBackupDb(ticketsJson, sendFileQuery);
            }
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync($"MatchId: {sendFileQuery.MatchId}, EventDate: {sendFileQuery.EventDate}", e);
        }
    }

    private async Task ExecuteRepositoryInsertBackupDb(ExcelOicModel ticketsJson, SendFileQuery sendFileQuery)
    {
        var criteria = new SendDataOicBackupDbCriteria
        {
            GlobalShowTime = sendFileQuery.GlobalShowTime.ZoneCanada(),
            MatchId = sendFileQuery.MatchId,
            TransInfoSendOICJson = ticketsJson.TransInfoSendOICJson
        };

        await repository.FetchAsync<LicenseeFile>(criteria);
    }
}