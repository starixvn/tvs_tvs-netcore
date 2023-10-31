using Fanex.Data.Repository;
using SpecialDelete.VoidByBetId.Criteria;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByBetId.Services.Validation;

public interface CheckAbnormalBetService
{
    Task<ResultCheckAbnormalBetViewModel> GetValidation(CheckAbnormalBetModel model);
}

public class CheckAbnormalBetServiceImp : CheckAbnormalBetService
{
    private readonly IDynamicRepository repository;

    public CheckAbnormalBetServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<ResultCheckAbnormalBetViewModel> GetValidation(CheckAbnormalBetModel model)
    {
        var results = await GetResultsFromMultiDb(model);
        var viewModel = new ResultCheckAbnormalBetViewModel
        {
            InvalidMatchId = Helper.GetIntersectTransIdString(results.Select(x => x.InvalidMatchId)),
            DifferentMatchTransIds = Helper.GetUnionTransIdString(results.Select(x => x.DifferentMatchTransIds)),
            InvalidTransIds = Helper.GetIntersectTransIdString(results.Select(x => x.InvalidTransIds)),
            MovedTransIds = Helper.GetUnionTransIdString(results.Select(x => x.MovedTransIds))
        };

        return viewModel;
    }

    private async Task<IEnumerable<ResultCheckAbnormalBetViewModel>> GetResultsFromMultiDb(CheckAbnormalBetModel message)
    {
        var results = new List<ResultCheckAbnormalBetViewModel>();
        foreach (var item in SiteDbGroupConstant.ServerList)
        {
            var criteria = new CheckAbnormalBetCriteria
            {
                SiteDbGroupId = item.Id,
                MatchId = message.MatchId,
                TransIds = message.TransIds
            };
            var result = await repository.GetAsync<ResultCheckAbnormalBetViewModel>(criteria);
            results.Add(result);
        }

        return results;
    }
}