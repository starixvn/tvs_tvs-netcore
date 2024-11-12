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

public class GetMarkedTicketsCountHandler(IDynamicRepository repository, SessionService sessionService)
    : IRequestHandler<GetMarkedTicketsCountRequest, int>
{
    public async Task<int> Handle(GetMarkedTicketsCountRequest request, CancellationToken cancellationToken)
    {
        var dataInAllServers = await GetAllMarkedTickets();
        return dataInAllServers.Sum(x => x.Total);
    }

    private async Task<IEnumerable<AllMarkedTicketModel>> GetAllMarkedTickets()
    {
        var fetchedData = await Task.WhenAll(FetchTasksInAllServer());
        var dataInAllServers = fetchedData.SelectMany(data => data);

        return dataInAllServers;
    }

    private IEnumerable<Task<IEnumerable<AllMarkedTicketModel>>> FetchTasksInAllServer()
    {
        var criteria = new AllMarkedTicketsCriteria
        {
            MarkedBy = sessionService.UserId
        };
        var fetchTasks = new List<Task<IEnumerable<AllMarkedTicketModel>>>();

        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var fetchTask = repository.FetchAsync<AllMarkedTicketModel>(criteria);
            fetchTasks.Add(fetchTask);
        }

        return fetchTasks;
    }
}