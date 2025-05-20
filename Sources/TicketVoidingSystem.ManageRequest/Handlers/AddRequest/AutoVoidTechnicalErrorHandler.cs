using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.TechnicalError;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class AddTechnicalErrorAutoVoidRequest : IRequest<Result>
{
    public long TransId { get; set; }
    public int MatchId { get; set; }
}

public class AutoVoidTechnicalErrorHandler(
    AddRequestAutoVoidProviderMistakeService addRequestAutoVoidProviderMistakeService,
    InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService)
    : IRequestHandler<AddTechnicalErrorAutoVoidRequest, Result>
{
    public async Task<Result> Handle(AddTechnicalErrorAutoVoidRequest request, CancellationToken cancellationToken)
    {
        var (validationResult, errorResult) = await addRequestAutoVoidProviderMistakeService.ValidateTickets(request.TransId.ToString());
        if (errorResult != null)
        {
            return errorResult;
        }

        var markTicketResult = await addRequestAutoVoidProviderMistakeService.MarkTickets(validationResult.TransInfoAddRequest.MarkTransIds);
        if (markTicketResult.ErrorCode != 0)
        {
            return markTicketResult;
        }

        var (requestId, addRequestResult) = await addRequestAutoVoidProviderMistakeService.ExecuteAddRequest(request.MatchId, validationResult);
        if (addRequestResult.ErrorCode != 0)
        {
            return addRequestResult;
        }

        await insertAutoVoidRequestQueueService.Execute(requestId, VoidActionTypeConstant.AutoVoidInstantId, [request.MatchId]);
        return addRequestResult;
    }
}