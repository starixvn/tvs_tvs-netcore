using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;

namespace TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;

public class GetHybridParlayRequest : QueryHybridParlay, IRequest<IList<TicketViewModel>>;

public class GetHybridParlayHandler(TicketsService ticketsService, IMapper mapper)
    : IRequestHandler<GetHybridParlayRequest, IList<TicketViewModel>>
{
    public async Task<IList<TicketViewModel>> Handle(GetHybridParlayRequest message, CancellationToken cancellationToken)
    {
        var tickets = await ticketsService.GetTickets(message.RefNo);

        return ticketsService.GetHybridTickets(tickets, message.Transdesc);
    }
}