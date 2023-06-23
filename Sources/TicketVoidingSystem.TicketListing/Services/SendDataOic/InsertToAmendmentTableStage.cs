using Fanex.Data.Repository;
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

    public InsertToAmendmentTableStageImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<LicenseeFile>> Execute(ExcelOicModel ticketsJson, SendFileQuery sendFileQuery)
    {
        var criteria = new SendDataOicCriteria
        {
            EventDate = sendFileQuery.EventDate,
            MatchId = sendFileQuery.MatchId,
            TransInfoSendOICJson = ticketsJson.TransInfoSendOICJson
        };

        return await repository.FetchAsync<LicenseeFile>(criteria);
    }
}