using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;

namespace TicketVoidingSystem.ManageVoidServices.Services;

public interface TicketVoidingQueueService
{
    Task<IEnumerable<TicketVoidingQueueModel>> GetQueueInAllServers(int voidingHistoryId);

    Task UpdateQueueByBatch(int siteDbGroupId, string queueIds, int statusId);
}

public class TicketVoidingQueueServiceImp(IDynamicRepository repository) : TicketVoidingQueueService
{
    public async Task<IEnumerable<TicketVoidingQueueModel>> GetQueueInAllServers(int voidingHistoryId)
    {
        var criteria = new GetTicketVoidingQueueCriteria
        {
            VoidingHistoryId = voidingHistoryId
        };

        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchAsync<TicketVoidingQueueModel>(criteria);
        });

        var queuesInAllServers = await Task.WhenAll(tasks);
        return queuesInAllServers.SelectMany(queues => queues);
    }

    public async Task UpdateQueueByBatch(int siteDbGroupId, string queueIds, int statusId)
    {
        var criteria = new UpdateTicketVoidingQueueByBatchCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            QueueIds = queueIds,
            StatusId = statusId
        };

        await repository.ExecuteAsync(criteria);
    }
}