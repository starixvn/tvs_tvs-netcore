using MediatR;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class EditRequest : EditRequestQuery, IRequest<Result>;

public class EditRequestHandler(EditRequestService editRequestService) : IRequestHandler<EditRequest, Result>
{
    public async Task<Result> Handle(EditRequest request, CancellationToken cancellationToken)
    {
        return await editRequestService.UpdateRequest(request);
    }
}