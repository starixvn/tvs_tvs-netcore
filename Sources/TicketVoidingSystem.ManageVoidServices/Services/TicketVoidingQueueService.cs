using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;

namespace TicketVoidingSystem.ManageVoidServices.Services
{
    public interface TicketVoidingQueueService
    {
        Task<IEnumerable<TicketVoidingQueueModel>> GetQueueInAllServers(int voidingHistoryId);

        Task UpdateQueueByBatch(int siteDbGroupId, string queueIds, int statusId);
    }

    public class TicketVoidingQueueServiceImp : TicketVoidingQueueService
    {
        private readonly IDynamicRepository repository;

        public TicketVoidingQueueServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<IEnumerable<TicketVoidingQueueModel>> GetQueueInAllServers(int voidingHistoryId)
        {
            var queueInAllServers = new List<TicketVoidingQueueModel>();
            var criteria = new GetTicketVoidingQueueCriteria
            {
                VoidingHistoryId = voidingHistoryId
            };

            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                criteria.SiteDbGroupId = server.Id;
                var queues = await repository.FetchAsync<TicketVoidingQueueModel>(criteria);
                queueInAllServers.AddRange(queues);
            }

            return queueInAllServers;
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
}