using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface ReducedOverBetTypesService
{
    Task<IEnumerable<ReducedOverBetTypesModel>> GetBetTypes(int matchId);
}

public class ReducedOverBetTypesServiceImp : ReducedOverBetTypesService
{
    private readonly IDynamicRepository repository;

    public ReducedOverBetTypesServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<ReducedOverBetTypesModel>> GetBetTypes(int matchId)
    {
        const string jsonPath = "App_Data/Data/ReducedOverBetTypes.json";
        var reducedBetTypesViewModel = Helper.DeserializeJsonFileToObject<ReducedOverBetTypesViewModel>(jsonPath);
        var reducedBetTypes = await GetReducedOverBetTypesHavesTickets(reducedBetTypesViewModel.ReducedOverBetTypes, matchId);

        return reducedBetTypes;
    }

    private async Task<IEnumerable<ReducedOverBetTypesModel>> GetReducedOverBetTypesHavesTickets(IEnumerable<ReducedOverBetTypesModel> reducedBetTypes, int matchId)
    {
        var allBetTypesOfMatch = await GetBetTypesHaveTickets(matchId);

        var results = reducedBetTypes
            .Where(betType => allBetTypesOfMatch.Any(x => int.Parse(x.Id) == betType.BetTypeId))
            .Select(betType =>
            {
                var x = allBetTypesOfMatch.FirstOrDefault(y => int.Parse(y.Id) == betType.BetTypeId);
                betType.BetTypeName = x?.Name;
                return betType;
            });

        return results;
    }

    private async Task<IEnumerable<BetTypeModel>> GetBetTypesHaveTickets(int matchId)
    {
        var criteria = new GetBetTypesHaveTicketsCriteria
        {
            MatchId = matchId
        };
        var betTypesAllServers = new List<BetTypeModel>();
        var fetchTasks = SiteDbGroupConstant.ServerList
            .Select(server => FetchDataAsync(server.Id, criteria));
        var fetchedData = await Task.WhenAll(fetchTasks);

        betTypesAllServers.AddRange(fetchedData.SelectMany(x => x));

        return betTypesAllServers;
    }

    private async Task<IEnumerable<BetTypeModel>> FetchDataAsync(int siteDbGroupId, GetBetTypesHaveTicketsCriteria criteria)
    {
        criteria.SiteDbGroupId = siteDbGroupId;
        return await repository.FetchAsync<BetTypeModel>(criteria);
    }
}