using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface AddRequestService
{
    Task<Result> Execute(AddRequestQuery query);
}

public class AddRequestServiceImp : AddRequestService
{
    private readonly AddRequestProcessStage addRequestProcessStage;
    private readonly MarkTicketsWhenAddEditService marketTicketsWhenEditService;
    private readonly GetUpdateResultService getUpdateResultService;

    public AddRequestServiceImp(AddRequestProcessStage addRequestProcessStage, MarkTicketsWhenAddEditService marketTicketsWhenEditService, GetUpdateResultService getUpdateResultService)
    {
        this.addRequestProcessStage = addRequestProcessStage;
        this.marketTicketsWhenEditService = marketTicketsWhenEditService;
        this.getUpdateResultService = getUpdateResultService;
    }

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