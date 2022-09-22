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
        Task<IEnumerable<AutoVoidRequestQueueModel>> GetQueueInAllServers(string broadcastSessionId);
    }

    public class AutoVoidRequestQueueServiceImp : AutoVoidRequestQueueService
    {
        private readonly IDynamicRepository repository;

        public AutoVoidRequestQueueServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<IEnumerable<AutoVoidRequestQueueModel>> GetQueueInAllServers(string broadcastSessionId)
        {
            var queueInAllServers = new List<AutoVoidRequestQueueModel>();
            var criteria = new GetAutoVoidRequestQueueCriteria
            {
                BroadcastSessionId = broadcastSessionId
            };

            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                criteria.SiteDbGroupId = server.Id;
                var queue = await repository.GetAsync<AutoVoidRequestQueueModel>(criteria);
                if (queue != null)
                {
                    queue.SiteDbGroupId = server.Id;
                }
                queueInAllServers.Add(queue);
            }

            return queueInAllServers;
        }
    }
}