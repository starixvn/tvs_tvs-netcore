using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.RecoverTicket;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckRecoverTicketRequest : CheckRecoverTicketModel, IRequest<CheckRecoverTicketViewModel>;

public class CheckRecoverTicketHandler(CheckRecoverTicketService checkRecoverTicketService)
    : IRequestHandler<CheckRecoverTicketRequest, CheckRecoverTicketViewModel>
{
    public async Task<CheckRecoverTicketViewModel> Handle(CheckRecoverTicketRequest request, CancellationToken cancellationToken)
    {
        return await checkRecoverTicketService.CheckRecoverTicket(request);
    }
}