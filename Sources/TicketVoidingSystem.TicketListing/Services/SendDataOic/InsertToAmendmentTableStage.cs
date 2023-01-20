using Fanex.Data.Repository;
using Microsoft.Extensions.Configuration;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Extensions;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Services.SendDataOic;

public interface InsertToAmendmentTableStage
{
    Task<bool> Execute(IEnumerable<ExcelOicModel> tickets, SendFileQuery sendFileQuery, string sessionId);
}

public class InsertToAmendmentTableStageImp : InsertToAmendmentTableStage
{
    private readonly IDynamicRepository repository;
    private readonly IConfiguration configuration;
    private readonly LoggingService loggingService;

    public InsertToAmendmentTableStageImp(IConfiguration configuration, IDynamicRepository repository, LoggingService loggingService)
    {
        this.configuration = configuration;
        this.repository = repository;
        this.loggingService = loggingService;
    }

    public async Task<bool> Execute(IEnumerable<ExcelOicModel> tickets, SendFileQuery sendFileQuery, string sessionId)
    {
        var isInsertMainDbSuccessful = await InsertToMainDb(tickets, sendFileQuery, sessionId);
        var env = configuration["EnvironmentName"];
        if (env.Equals("UAT") || env.Equals("PRO") || env.Equals("PROAWS"))
        {
            var isInsertBackupDbSuccessful = await InsertToBackupDb(tickets, sendFileQuery, sessionId);
            return isInsertMainDbSuccessful || isInsertBackupDbSuccessful;
        }

        return isInsertMainDbSuccessful;
    }

    private async Task<bool> InsertToMainDb(IEnumerable<ExcelOicModel> tickets, SendFileQuery sendFileQuery, string sessionId)
    {
        try
        {
            var criteria = new SendDataOicCriteria
            {
                SessionID = sessionId,
                EventDate = sendFileQuery.EventDate,
                MatchId = sendFileQuery.MatchId,
                SiteName = sendFileQuery.LicenseeName,
                ResultAmendmentXml = tickets.ToResultAmendmentXML()
            };

            await repository.ExecuteAsync(criteria);

            return true;
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync($"SessionId: {sessionId}", e);
            return false;
        }
    }

    private async Task<bool> InsertToBackupDb(IEnumerable<ExcelOicModel> tickets, SendFileQuery sendFileQuery, string sessionId)
    {
        try
        {
            var criteria = new SendDataOicBackupCriteria
            {
                SessionID = sessionId,
                EventDate = sendFileQuery.EventDate,
                MatchId = sendFileQuery.MatchId,
                SiteName = sendFileQuery.LicenseeName,
                ResultAmendmentXml = tickets.ToResultAmendmentXML()
            };

            await repository.ExecuteAsync(criteria);

            return true;
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync($"SessionId: {sessionId}", e);
            return false;
        }
    }
}