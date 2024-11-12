using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;

namespace TicketVoidingSystem.ManageVoidServices.Services;

public interface VoidingHistoryService
{
    Task<IEnumerable<VoidingHistoryModel>> GetByRequestId(int requestId);

    Task UpdateVoidingHistory(int voidingHistoryId, int statusId);
}

public class VoidingHistoryServiceImp(IDynamicRepository repository) : VoidingHistoryService
{
    public async Task<IEnumerable<VoidingHistoryModel>> GetByRequestId(int requestId)
    {
        var criteria = new GetVoidingHistoryCriteria
        {
            RequestId = requestId
        };

        return await repository.FetchAsync<VoidingHistoryModel>(criteria);
    }

    public async Task UpdateVoidingHistory(int voidingHistoryId, int statusId)
    {
        var criteria = new UpdateVoidingHistoryCriteria
        {
            VoidingHistoryId = voidingHistoryId,
            StatusId = statusId,
            ReasonId = null,
            MessageId = null
        };

        await repository.ExecuteAsync(criteria);
    }
}