using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface MarkTicketsWhenEditService
{
    Task<IEnumerable<Result>> Execute(EditRequestQuery query);
}

public class MarkTicketsWhenEditServiceImp : MarkTicketsWhenEditService
{
    private readonly MarkTicketsService markTicketsService;

    public MarkTicketsWhenEditServiceImp(MarkTicketsService markTicketsService)
    {
        this.markTicketsService = markTicketsService;
    }

    public async Task<IEnumerable<Result>> Execute(EditRequestQuery query)
    {
        var results = new List<Result>();
        if (!string.IsNullOrWhiteSpace(query.MarkTransIds))
        {
            results.AddRange(await ExecuteMarkTickets(query));
        }

        if (!string.IsNullOrWhiteSpace(query.UnMarkTransIds))
        {
            results.AddRange(await ExecuteUnMarkTickets(query));
        }

        return results;
    }

    private async Task<IEnumerable<Result>> ExecuteMarkTickets(EditRequestQuery query)
    {
        return await markTicketsService.MarkTicketsInTVS(query.MarkTransIds, query.IssueTypeId, MarkTypeConstant.ExecuteMarkTickets);
    }

    private async Task<IEnumerable<Result>> ExecuteUnMarkTickets(EditRequestQuery query)
    {
        return await markTicketsService.MarkTicketsInTVS(query.UnMarkTransIds, query.IssueTypeId, MarkTypeConstant.ExecuteUnMarkTickets);
    }
}