using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.TechnicalError;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class AddTechnicalErrorAutoVoidRequest : IRequest<Result>
{
    public long TransId { get; set; }
    public string OperatorKey { get; set; }
}

public class AutoVoidTechnicalErrorHandler(
    AddRequestAutoVoidProviderMistakeService addRequestAutoVoidProviderMistakeService,
    InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService,
    OperatorKeyEncryptionService operatorKeyEncryptionService)
    : IRequestHandler<AddTechnicalErrorAutoVoidRequest, Result>
{
    public async Task<Result> Handle(AddTechnicalErrorAutoVoidRequest request, CancellationToken cancellationToken)
    {

        var operatorValidationResult = operatorKeyEncryptionService.ValidateOperatorKey(request.OperatorKey);
        if (operatorValidationResult.ErrorCode != 0)
        {
            return operatorValidationResult;
        }

        var (ticketValidationResult, errorResult) = await addRequestAutoVoidProviderMistakeService.ValidateTickets(request.TransId.ToString());
        if (errorResult != null)
        {
            return errorResult;
        }

        var markTicketResult = await addRequestAutoVoidProviderMistakeService.MarkTickets(ticketValidationResult.TransInfoAddRequest.MarkTransIds);
        if (markTicketResult.ErrorCode != 0)
        {
            return markTicketResult;
        }

        var matchId = ticketValidationResult.Validation.MatchId;
        var (requestId, addRequestResult) = await addRequestAutoVoidProviderMistakeService.ExecuteAddRequest(matchId, ticketValidationResult);
        if (addRequestResult.ErrorCode != 0)
        {
            return addRequestResult;
        }

        await insertAutoVoidRequestQueueService.Execute(requestId, VoidActionTypeConstant.AutoVoidInstantId, [matchId]);
        return addRequestResult;
    }
}