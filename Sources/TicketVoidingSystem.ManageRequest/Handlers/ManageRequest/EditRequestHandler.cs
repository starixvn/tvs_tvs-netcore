using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class EditRequest : EditRequestQuery, IRequest<Result>
{
}

public class EditRequestHandler : IRequestHandler<EditRequest, Result>
{
    private readonly EditRequestService editRequestService;

    public EditRequestHandler(EditRequestService editRequestService)
    {
        this.editRequestService = editRequestService;
    }

    public async Task<Result> Handle(EditRequest request, CancellationToken cancellationToken)
    {
        return await editRequestService.UpdateRequest(request);
    }
}