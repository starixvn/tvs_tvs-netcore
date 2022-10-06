using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;

namespace TicketVoidingSystem.ManageVoidServices.Services
{
    public interface AutoVoidRequestQueueService
    {
        Task<IEnumerable<AutoVoidRequestQueueModel>> GetQueueInAllServers(string broadcastSessionId, int? statusId);

        Task UpdateQueue(int siteDbGroupId, int queueId, string broadcastSessionId, int? statusId, bool? isUpdateStartTime, string errorMessage);
    }

    public class AutoVoidRequestQueueServiceImp : AutoVoidRequestQueueService
    {
        private readonly IDynamicRepository repository;

        public AutoVoidRequestQueueServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<IEnumerable<AutoVoidRequestQueueModel>> GetQueueInAllServers(string broadcastSessionId, int? statusId)
        {
            var queueInAllServers = new List<AutoVoidRequestQueueModel>();
            var criteria = new GetAutoVoidRequestQueueCriteria
            {
                BroadcastSessionId = broadcastSessionId,
                StatusId = statusId
            };

            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                criteria.SiteDbGroupId = server.Id;
                var queues = await repository.FetchAsync<AutoVoidRequestQueueModel>(criteria);
                queueInAllServers.AddRange(queues);
            }

            return queueInAllServers;
        }

        public async Task UpdateQueue(int siteDbGroupId, int queueId, string broadcastSessionId, int? statusId, bool? isUpdateStartTime, string errorMessage)
        {
            var criteria = new UpdateAutoVoidRequestQueueCriteria
            {
                SiteDbGroupId = siteDbGroupId,
                QueueId = queueId,
                BroadcastSessionId = broadcastSessionId,
                StatusId = statusId,
                IsUpdateStartTime = isUpdateStartTime,
                ErrMsg = errorMessage
            };

            await repository.ExecuteAsync(criteria);
        }
    }
}