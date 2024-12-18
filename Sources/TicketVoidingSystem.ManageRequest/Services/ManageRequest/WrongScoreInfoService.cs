using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface WrongScoreInfoService
{
    Task<IEnumerable<WrongScoreInfoViewModel>> GetWrongScoreInfo(GetWrongScoreInfoCriteria criteria);
}

public class WrongScoreInfoServiceImp(IDynamicRepository repository) : WrongScoreInfoService
{
    public async Task<IEnumerable<WrongScoreInfoViewModel>> GetWrongScoreInfo(GetWrongScoreInfoCriteria criteria)
    {
        return await repository.FetchAsync<WrongScoreInfoViewModel>(criteria);
    }
}