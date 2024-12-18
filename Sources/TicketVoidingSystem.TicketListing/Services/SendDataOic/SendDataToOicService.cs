using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Services.SendDataOic;

public interface SendDataToOicService
{
    Task<AmendmentResponse> Send(IList<SendFileQuery> queries, string affectedTickets);
}

public class SendDataToOicServiceImp(
    GetTicketsService getTicketsService,
    InsertToAmendmentTableStage insertToAmendmentTableStage,
    CallApiAmendmentStage callApiAmendmentStage)
    : SendDataToOicService
{
    public async Task<AmendmentResponse> Send(IList<SendFileQuery> queries, string affectedTickets)
    {
        var joinQuery = queries.FirstOrDefault() ?? new SendFileQuery();
        joinQuery.LicenseeName = string.Join(",", queries.Select(x => x.LicenseeName));
        var ticketJson = await getTicketsService.GetTicketsForSendDataOic(joinQuery, affectedTickets);
        var resultLicenseeFiles = await insertToAmendmentTableStage.Execute(ticketJson, joinQuery);

        return await callApiAmendmentStage.Execute(resultLicenseeFiles, joinQuery.Title, joinQuery.EventDate);
    }
}