using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;

public class MarkAllTicketsRequest : MarkAllTicketsQuery, IRequest<Result>
{
}

public class MarkAllTicketsHandler : IRequestHandler<MarkAllTicketsRequest, Result>
{
    private readonly MarkAllTicketsService markAllTicketsService;

    public MarkAllTicketsHandler(MarkAllTicketsService markAllTicketsService)
    {
        this.markAllTicketsService = markAllTicketsService;
    }

    public async Task<Result> Handle(MarkAllTicketsRequest request, CancellationToken cancellationToken)
    {
        return await markAllTicketsService.Execute(request);
    }
}