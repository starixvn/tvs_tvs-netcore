using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface EditRequestService
{
    Task<Result> UpdateRequest(EditRequestQuery query);
}

public class EditRequestServiceImp(
    MarkTicketsWhenAddEditService marketTicketsWhenEditService,
    ReCalculateTicketsService reCalculateTicketsService,
    UpdateRequestProcessStage updateRequestProcessStage,
    GetUpdateResultService getUpdateResultService)
    : EditRequestService
{
    public async Task<Result> UpdateRequest(EditRequestQuery query)
    {
        var markTicketResult = await marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds);
        var markTicketError = getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService), markTicketResult.MarkedTickets);
        if (markTicketError != null)
        {
            return markTicketError;
        }

        var reCalcTicketsAbnormalResults = await reCalculateTicketsService.Execute(query.AbnormalBetInfo, query.IssueTypeId, query.RemoveTransIds);
        var reCalcTicketError = getUpdateResultService.GetFirstError(reCalcTicketsAbnormalResults, nameof(ReCalculateTicketsService), markTicketResult.MarkedTickets);
        if (reCalcTicketError != null)
        {
            return reCalcTicketError;
        }

        return await updateRequestProcessStage.Execute(query, markTicketResult.MarkedTickets);
    }
}