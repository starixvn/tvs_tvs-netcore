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
        var (isInsertToAmendmentTableSuccessful, resultLicensees) = await InsertToAmendmentTable(queries, affectedTickets);
        if (isInsertToAmendmentTableSuccessful)
        {
            return await callApiAmendmentStage.Execute(resultLicensees, queries[0].Title, queries[0].EventDate);
        }

        return new AmendmentResponse
        {
            Code = 1,
            Message = "Error when insert to Amendment table."
        };
    }

    private async Task<(bool, IList<LicenseeFile>)> InsertToAmendmentTable(IList<SendFileQuery> queries, string affectedTickets)
    {
        var resultLicensees = new List<LicenseeFile>();
        var isInsertToAmendmentTableSuccessful = true;
        var i = 0;
        while (isInsertToAmendmentTableSuccessful && i < queries.Count)
        {
            isInsertToAmendmentTableSuccessful = await InsertToAmendmentTableByQuery(queries[i], affectedTickets, resultLicensees);
            i++;
        }

        return (isInsertToAmendmentTableSuccessful, resultLicensees);
    }

    private async Task<bool> InsertToAmendmentTableByQuery(SendFileQuery currentQuery, string affectedTickets, ICollection<LicenseeFile> resultInsert)
    {
        var sessionId = Guid.NewGuid().ToString();
        var tickets = await getTicketsService.GetTicketsForSendDataOic(currentQuery, affectedTickets);
        var isInsertSuccessful = await insertToAmendmentTableStage.Execute(tickets, currentQuery, sessionId);
        if (isInsertSuccessful)
        {
            var licensee = new LicenseeFile
            {
                SessionID = sessionId,
                Name = currentQuery.LicenseeName
            };
            resultInsert.Add(licensee);
            return true;
        }

        return false;
    }
}