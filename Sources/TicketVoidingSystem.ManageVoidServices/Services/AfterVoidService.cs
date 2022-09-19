using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;

namespace TicketVoidingSystem.ManageVoidServices.Services
{
    public interface AfterVoidService
    {
        Task UpdateVoidBetAutomationServiceInfo(VoidBetAutomationModel model);

        Task<VoidBetAutomationModel> GetVoidBetAutomationServiceInfo(VoidBetAutomationModel model);
    }

    public class AfterVoidServiceImp : AfterVoidService
    {
        private readonly IDynamicRepository repository;

        public AfterVoidServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task UpdateVoidBetAutomationServiceInfo(VoidBetAutomationModel model)
        {
            if (model.StatusId == null)
            {
                await UpdateServiceAfterVoidData(model);
            }
            else
            {
                await UpdateServiceStatus(model.RequestId, model.VoidingHistoryId, (byte)model.StatusId);
            }
        }

        public async Task<VoidBetAutomationModel> GetVoidBetAutomationServiceInfo(VoidBetAutomationModel model)
        {
            var criteria = new GetVoidBetAutomationInfoCriteria
            {
                RequestId = model.RequestId,
                VoidingHistoryId = model.VoidingHistoryId,
            };

            return await repository.GetAsync<VoidBetAutomationModel>(criteria);
        }

        private async Task UpdateServiceStatus(int requestId, int voidingHistoryId, byte statusId)
        {
            var criteria = new UpdateVoidBetAutomationInfoCriteria
            {
                UpdateType = VoidBetAutomationServiceUpdateType.UpdateStatusByVoidingHistory,
                RequestId = requestId,
                VoidingHistoryId = voidingHistoryId,
                StatusId = statusId,
            };

            await repository.ExecuteAsync(criteria);
        }

        private async Task UpdateServiceAfterVoidData(VoidBetAutomationModel model)
        {
            var criteria = new UpdateVoidBetAutomationInfoCriteria
            {
                UpdateType = VoidBetAutomationServiceUpdateType.UpdateAllAfterVoidSteps,
                RequestId = model.RequestId,
                VoidingHistoryId = model.VoidingHistoryId,
                IsRunExternalService = model.IsRunExternalService,
                MessageId = model.MessageId,
                ReasonId = model.ReasonId,
                IsSentBatchMessage = model.IsSentBatchMessage,
                IsSentMessageToAdminSite = model.IsSentMessageToAdminSite,
                IsInsertedVoidedTransaction = model.IsInsertedVoidedTransaction,
                IsUpdatedVoidingHistory = model.IsUpdatedVoidingHistory,
                IsSentEmail = model.IsSentEmail,
                IsSentLetsTalk = model.IsSentLetsTalk
            };

            await repository.ExecuteAsync(criteria);
        }
    }
}