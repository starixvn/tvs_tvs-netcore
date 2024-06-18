using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;

namespace TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;

public class GetNormalParlayRequest : QueryNormalParlay, IRequest<IList<TicketViewModel>>
{
}

public class GetNormalParlayHandler : IRequestHandler<GetNormalParlayRequest, IList<TicketViewModel>>
{
    private readonly TicketsService ticketsService;

    public GetNormalParlayHandler(TicketsService ticketsService)
    {
        this.ticketsService = ticketsService;
    }

    public async Task<IList<TicketViewModel>> Handle(GetNormalParlayRequest message, CancellationToken cancellationToken)
    {
        var tickets = await ticketsService.GetTickets(message.RefNo);
        return ticketsService.GetTickets(tickets);
    }
}