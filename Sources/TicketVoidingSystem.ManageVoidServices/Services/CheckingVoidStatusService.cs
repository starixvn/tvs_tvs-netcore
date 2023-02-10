using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;

namespace TicketVoidingSystem.ManageVoidServices.Services
{
    public interface CheckingVoidStatusService
    {
        Task<IEnumerable<VoidServiceModel>> GetVoidServiceData(string broadcastSessionId, int? requestId);

        Task UpdateVoidService(int? siteDbGroupId, int? requestId, int? voidingHistoryId, int? statusId);
    }

    public class CheckingVoidStatusServiceImp : CheckingVoidStatusService
    {
        private readonly IDynamicRepository repository;

        public CheckingVoidStatusServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<IEnumerable<VoidServiceModel>> GetVoidServiceData(string broadcastSessionId, int? requestId)
        {
            var criteria = new GetVoidServiceDataCriteria
            {
                BroadcastSessionId = broadcastSessionId,
                RequestId = requestId
            };

            return await repository.FetchAsync<VoidServiceModel>(criteria);
        }

        public async Task UpdateVoidService(int? siteDbGroupId, int? requestId, int? voidingHistoryId, int? statusId)
        {
            var criteria = new UpdateVoidServiceCriteria
            {
                SiteDbGroupId = siteDbGroupId,
                RequestId = requestId,
                VoidingHistoryId = voidingHistoryId,
                StatusId = statusId
            };

            await repository.ExecuteAsync(criteria);
        }
    }
}