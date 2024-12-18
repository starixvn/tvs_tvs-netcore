using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;

public class MarkTicketsRequest : MarkTicketsQuery, IRequest<Result>;

public class MarkTicketsHandler(MarkTicketsService markTicketsService) : IRequestHandler<MarkTicketsRequest, Result>
{
    public async Task<Result> Handle(MarkTicketsRequest request, CancellationToken cancellationToken)
    {
        return await markTicketsService.Execute(request);
    }
}