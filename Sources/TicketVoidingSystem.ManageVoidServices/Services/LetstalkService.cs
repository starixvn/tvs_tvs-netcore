using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;

namespace TicketVoidingSystem.ManageVoidServices.Services;

public interface LetstalkService
{
    Task<IEnumerable<LetstalkModel>> GetLetstalkModel(int requestId, string broadcastSessionId);

    Task<bool> UpdateLetstalk(int requestId, string broadcastSessionId, int statusId);
}

public class LetstalkServiceImp : LetstalkService
{
    private readonly IDynamicRepository repository;

    public LetstalkServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<LetstalkModel>> GetLetstalkModel(int requestId, string broadcastSessionId)
    {
        var criteria = new GetLetstalkCriteria
        {
            RequestId = requestId,
            BroadcastSessionId = broadcastSessionId
        };

        return await repository.FetchAsync<LetstalkModel>(criteria);
    }

    public async Task<bool> UpdateLetstalk(int requestId, string broadcastSessionId, int statusId)
    {
        var criteria = new UpdateLetstalkCriteria
        {
            RequestId = requestId,
            BroadcastSessionId = broadcastSessionId,
            StatusId = statusId
        };

        await repository.ExecuteAsync(criteria);
        return true;
    }
}