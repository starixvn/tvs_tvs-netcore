using Fanex.Data.Repository;
using SpecialDelete.UploadBatchMessage.Criteria;
using SpecialDelete.UploadBatchMessage.Models;

namespace SpecialDelete.UploadBatchMessage.Repositories;

public interface UploadBatchMessageRepository
{
    Task<MessageResult> GetReceivedUsers(GetReceivedUsersCriteria criteria);
}

public class UploadBatchMessageRepositoryImp : UploadBatchMessageRepository
{
    private readonly IDynamicRepository repository;

    public UploadBatchMessageRepositoryImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<MessageResult> GetReceivedUsers(GetReceivedUsersCriteria criteria)
    {
        var (creditTrans, invalidTransId) = await repository.FetchMultipleAsync<ReceivedUserViewModel, string>(criteria);
        return new MessageResult
        {
            CreditTrans = creditTrans.ToList(),
            InvalidTransId = invalidTransId.FirstOrDefault() ?? string.Empty
        };
    }
}