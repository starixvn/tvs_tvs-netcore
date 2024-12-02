using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class GetTicketsMiniRequest : GetTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetTicketsMiniHandler : IRequestHandler<GetTicketsMiniRequest, TicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;
    private readonly TicketsViewModelService ticketsViewModelService;
    private readonly CheckPermissionOnRequestService checkPermissionOnRequestService;

    public GetTicketsMiniHandler(GetTicketsService getTicketsService, TicketsViewModelService ticketsViewModelService, CheckPermissionOnRequestService checkPermissionOnRequestService)
    {
        this.getTicketsService = getTicketsService;
        this.ticketsViewModelService = ticketsViewModelService;
        this.checkPermissionOnRequestService = checkPermissionOnRequestService;
    }

    public async Task<TicketsViewModel> Handle(GetTicketsMiniRequest request, CancellationToken cancellationToken)
    {
        var model = new TicketsViewModel();
        var tickets = await getTicketsService.GetTickets(request);
        var voidPermission = await checkPermissionOnRequestService.GetVoidPermission();
        await ticketsViewModelService.UpdateViewModel(model, tickets, request.IssueTypeId, voidPermission, request.Match?.MatchId);

        return model;
    }
}