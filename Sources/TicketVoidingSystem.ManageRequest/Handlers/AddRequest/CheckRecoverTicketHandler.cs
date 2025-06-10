using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.RecoverTicket;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckRecoverTicketRequest : CheckRecoverTicketCriteria, IRequest<CheckRecoverTicketViewModel>;

public class CheckRecoverTicketHandler(CheckRecoverTicketService checkRecoverTicketService)
    : IRequestHandler<CheckRecoverTicketRequest, CheckRecoverTicketViewModel>
{
    public async Task<CheckRecoverTicketViewModel> Handle(CheckRecoverTicketRequest request, CancellationToken cancellationToken)
    {
        return await checkRecoverTicketService.CheckRecoverTicket(request);
    }
}