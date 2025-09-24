using MediatR;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetMarkedTicketsCountRequest : IRequest<int>;

public class GetMarkedTicketsCountHandler(OnlineServerRepository onlineServerRepository, SessionService sessionService)
    : IRequestHandler<GetMarkedTicketsCountRequest, int>
{
    public async Task<int> Handle(GetMarkedTicketsCountRequest request, CancellationToken cancellationToken)
    {
        var dataInAllServers = await GetAllMarkedTickets();
        return dataInAllServers.Sum(x => x.Total);
    }

    private async Task<IEnumerable<AllMarkedTicketModel>> GetAllMarkedTickets()
    {
        var currentOnlineServerId = await onlineServerRepository.GetOnlineServerIds();
        var criteria = new AllMarkedTicketsCriteria
        {
            MarkedBy = sessionService.UserId,
            OnlineServerId = currentOnlineServerId
        };
        var dataInAllServers = await onlineServerRepository.FetchAsync<AllMarkedTicketModel>(criteria);

        return dataInAllServers;
    }
}