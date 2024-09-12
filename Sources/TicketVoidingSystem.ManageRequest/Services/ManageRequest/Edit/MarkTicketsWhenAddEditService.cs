using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface MarkTicketsWhenAddEditService
{
    Task<IEnumerable<Result>> Execute(int issueTypeId, string markTransIds, string unMarkTransIds);
}

public class MarkTicketsWhenAddEditServiceImp : MarkTicketsWhenAddEditService
{
    private readonly MarkTicketsService markTicketsService;

    public MarkTicketsWhenAddEditServiceImp(MarkTicketsService markTicketsService)
    {
        this.markTicketsService = markTicketsService;
    }

    public async Task<IEnumerable<Result>> Execute(int issueTypeId, string markTransIds, string unMarkTransIds)
    {
        var results = new List<Result>();
        if (!string.IsNullOrWhiteSpace(markTransIds))
        {
            results.AddRange(await ExecuteMarkTickets(issueTypeId, markTransIds));
        }

        if (!string.IsNullOrWhiteSpace(unMarkTransIds))
        {
            results.AddRange(await ExecuteUnMarkTickets(issueTypeId, unMarkTransIds));
        }

        return results;
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