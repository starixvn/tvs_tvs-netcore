using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface MarkTicketsWhenAddEditService
{
    Task<MarkTicketsResult> Execute(int issueTypeId, string markTransIds, string unMarkTransIds);
}

public class MarkTicketsWhenAddEditServiceImp(MarkTicketsService markTicketsService) : MarkTicketsWhenAddEditService
{
    public async Task<MarkTicketsResult> Execute(int issueTypeId, string markTransIds, string unMarkTransIds)
    {
        var combineResults = new List<Result>();
        var markedTickets = new List<long>();

        if (!issueTypeId.IsArchivedTicket())
        {
            if (!string.IsNullOrWhiteSpace(markTransIds))
            {
                var markResults = await ExecuteMarkTickets(issueTypeId, markTransIds);
                combineResults.AddRange(markResults.MarkedResults);
                markedTickets.AddRange(markResults.MarkedTickets);
            }

            if (!string.IsNullOrWhiteSpace(unMarkTransIds))
            {
                var unmarkResults = await ExecuteUnMarkTickets(issueTypeId, unMarkTransIds);
                combineResults.AddRange(unmarkResults.MarkedResults);
            }
        }

        return new MarkTicketsResult
        {
            MarkedResults = combineResults,
            MarkedTickets = markedTickets
        };
    }

    private async Task<MarkTicketsResult> ExecuteMarkTickets(int issueTypeId, string markTransIds)
    {
        return await markTicketsService.MarkTicketsInTVS(markTransIds, issueTypeId, MarkTypeConstant.ExecuteMarkTickets);
    }

    private async Task<MarkTicketsResult> ExecuteUnMarkTickets(int issueTypeId, string unMarkTransIds)
    {
        return await markTicketsService.MarkTicketsInTVS(unMarkTransIds, issueTypeId, MarkTypeConstant.ExecuteUnMarkTickets);
    }
}