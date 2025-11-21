using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Models.JackTimeHybridParlay;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;

namespace TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;

public class GetHybridParlayRequest : HybridParlayChoiceModel, IRequest<IList<TicketViewModel>>;

public class GetHybridParlayHandler(TicketsService ticketsService)
    : IRequestHandler<GetHybridParlayRequest, IList<TicketViewModel>>
{
    public async Task<IList<TicketViewModel>> Handle(GetHybridParlayRequest message, CancellationToken cancellationToken)
    {
        var tickets = await ticketsService.GetTickets(message.RefNo);

        return ticketsService.GetHybridTickets(tickets, message);
    }
}