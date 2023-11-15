using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface ReducedOverBetTypesService
{
    Task<IEnumerable<ReducedOverBetTypesModel>> GetBetTypes(int matchId);
}

public class ReducedOverBetTypesServiceImp : ReducedOverBetTypesService
{
    private readonly BetTypesRepository betTypesRepository;

    public ReducedOverBetTypesServiceImp(BetTypesRepository betTypesRepository)
    {
        this.betTypesRepository = betTypesRepository;
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
        var allBetTypesOfMatch = await betTypesRepository.GetBetTypesHaveTicketsForTvs(matchId);

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
}