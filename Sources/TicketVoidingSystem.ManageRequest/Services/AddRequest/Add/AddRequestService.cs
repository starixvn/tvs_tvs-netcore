using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface AddRequestService
{
    Task<Result> Execute(AddRequestQuery query);
}

public class AddRequestServiceImp(
    AddRequestProcessStage addRequestProcessStage,
    MarkTicketsWhenAddEditService marketTicketsWhenEditService,
    GetUpdateResultService getUpdateResultService)
    : AddRequestService
{
    public async Task<Result> Execute(AddRequestQuery query)
    {
        var markTicketResult = await marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds);

        var markTicketError = getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService), markTicketResult.MarkedTickets);
        if (markTicketError != null)
        {
            return markTicketError;
        }

        return await addRequestProcessStage.Execute(query, markTicketResult.MarkedTickets);
    }
}