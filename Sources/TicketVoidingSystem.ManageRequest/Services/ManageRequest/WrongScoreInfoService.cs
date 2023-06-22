using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface WrongScoreInfoService
{
    Task<IEnumerable<WrongScoreInfoViewModel>> GetWrongScoreInfo(GetWrongScoreInfoCriteria criteria);
}

public class WrongScoreInfoServiceImp : WrongScoreInfoService
{
    private readonly IDynamicRepository repository;

    public WrongScoreInfoServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<WrongScoreInfoViewModel>> GetWrongScoreInfo(GetWrongScoreInfoCriteria criteria)
    {
        var data = await repository.FetchAsync<WrongScoreInfoViewModel>(criteria);

        return data;
    }
}