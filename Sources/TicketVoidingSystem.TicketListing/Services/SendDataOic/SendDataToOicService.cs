using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Services.SendDataOic;

public interface SendDataToOicService
{
    Task<AmendmentResponse> Send(IList<SendFileQuery> queries, string affectedTickets);
}

public class SendDataToOicServiceImp : SendDataToOicService
{
    private readonly InsertToAmendmentTableStage insertToAmendmentTableStage;
    private readonly CallApiAmendmentStage callApiAmendmentStage;
    private readonly GetTicketsService getTicketsService;

    public SendDataToOicServiceImp(GetTicketsService getTicketsService, InsertToAmendmentTableStage insertToAmendmentTableStage, CallApiAmendmentStage callApiAmendmentStage)
    {
        this.getTicketsService = getTicketsService;
        this.insertToAmendmentTableStage = insertToAmendmentTableStage;
        this.callApiAmendmentStage = callApiAmendmentStage;
    }

    public async Task<AmendmentResponse> Send(IList<SendFileQuery> queries, string affectedTickets)
    {
        var joinQuery = queries.FirstOrDefault() ?? new SendFileQuery();
        joinQuery.LicenseeName = string.Join(",", queries.Select(x => x.LicenseeName));
        var ticketJson = await getTicketsService.GetTicketsForSendDataOic(joinQuery, affectedTickets);
        var resultLicenseeFiles = await insertToAmendmentTableStage.Execute(ticketJson, joinQuery);

        return await callApiAmendmentStage.Execute(resultLicenseeFiles, joinQuery.Title, joinQuery.EventDate);
    }
}