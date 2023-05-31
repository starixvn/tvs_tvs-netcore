using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetMarkedTicketsCountRequest : IRequest<int>
{
}

public class GetMarkedTicketsCountHandler : IRequestHandler<GetMarkedTicketsCountRequest, int>
{
    private readonly SessionService sessionService;
    private readonly IDynamicRepository repository;

    public GetMarkedTicketsCountHandler(IDynamicRepository repository, SessionService sessionService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<int> Handle(GetMarkedTicketsCountRequest request, CancellationToken cancellationToken)
    {
        var dataInAllServers = new List<AllMarkedTicketModel>();
        var criteria = new AllMarkedTicketsCriteria
        {
            MarkedBy = sessionService.UserId
        };
        // Jacob: Nên xài Task.WaitAll để chạy song song
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var data = await repository.FetchAsync<AllMarkedTicketModel>(criteria, cancellationToken);
            dataInAllServers.AddRange(data);
        }

        return dataInAllServers.Sum(x => x.Total);
    }
}