using Fanex.Data.Repository;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Services.SendDataOic;

public interface InsertToAmendmentTableStage
{
    Task<IEnumerable<LicenseeFile>> Execute(ExcelOicModel ticketsJson, SendFileQuery sendFileQuery);
}

public class InsertToAmendmentTableStageImp(IDynamicRepository repository)
    : InsertToAmendmentTableStage
{
    public async Task<IEnumerable<LicenseeFile>> Execute(ExcelOicModel ticketsJson, SendFileQuery sendFileQuery)
    {
        var criteria = new SendDataOicCriteria
        {
            GlobalShowTime = sendFileQuery.GlobalShowTime.ZoneCanada(),
            MatchId = sendFileQuery.MatchId,
            TransInfoSendOICJson = ticketsJson.TransInfoSendOICJson
        };

        return await repository.FetchAsync<LicenseeFile>(criteria);
    }
}