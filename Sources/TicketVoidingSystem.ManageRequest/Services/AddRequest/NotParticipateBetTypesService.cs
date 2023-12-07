using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface NotParticipateBetTypesService
{
    Task<NotParticipateBetTypesViewModel> GetNotParticipateBetType(int matchId);
}

public class NotParticipateBetTypesServiceImp : NotParticipateBetTypesService
{
    private readonly BetTypesRepository betTypesRepository;
    private readonly IDynamicRepository dynamicRepository;

    public NotParticipateBetTypesServiceImp(BetTypesRepository betTypesRepository, IDynamicRepository dynamicRepository)
    {
        this.betTypesRepository = betTypesRepository;
        this.dynamicRepository = dynamicRepository;
    }

    public async Task<NotParticipateBetTypesViewModel> GetNotParticipateBetType(int matchId)
    {
        const string jsonPath = "App_Data/Data/NotParticipateBetTypes.json";
        var notParticipateBetTypesJson = Utilities.Helper.DeserializeJsonFileToObject<NotParticipateBetTypesViewModel>(jsonPath);
        var notParticipateBetTypesHaveTicket = await GetNotParticipateBetTypesHavesTickets(notParticipateBetTypesJson.NotParticipateBetTypes, matchId);

        return new NotParticipateBetTypesViewModel
        {
            NotParticipateBetTypes = await GetNotParticipateBetTypesHavesTickets(notParticipateBetTypesJson.NotParticipateBetTypes, matchId),
            NotParticipatePlayers = await GetPlayerHaveTickets(notParticipateBetTypesHaveTicket, matchId)
        };
    }

    private async Task<IEnumerable<OddsInfoViewModel>> GetPlayerHaveTickets(IEnumerable<NotParticipateBetTypesModel> notParticipateBetTypesHaveTicket, int matchId)
    {
        var criteria = new GetOddsInfoCriteria
        {
            MatchId = matchId,
            BetTypes = string.Join(",", notParticipateBetTypesHaveTicket.Select(x => x.BetTypeId))
        };

        return await dynamicRepository.FetchAsync<OddsInfoViewModel>(criteria);
    }

    private async Task<IEnumerable<NotParticipateBetTypesModel>> GetNotParticipateBetTypesHavesTickets(IEnumerable<NotParticipateBetTypesModel> betTypes, int matchId)
    {
        var allBetTypesOfMatch = await betTypesRepository.GetBetTypesHaveTicketsForTvs(matchId);
        var results = betTypes
            .Where(betType => allBetTypesOfMatch.Any(x => int.Parse(x.Id) == betType.BetTypeId))
            .Select(betType =>
            {
                var x = allBetTypesOfMatch.FirstOrDefault(y => int.Parse(y.Id) == betType.BetTypeId);
                betType.BetTypeName = x?.Name;
                betType.ParentName = GetGroupName(betType.ParentId);
                return betType;
            });

        return results;
    }

    private static string GetGroupName(int parentId)
    {
        return parentId switch
        {
            1 => "1 Inns",
            2 => "2 Inns",
            3 => "FT",
            _ => string.Empty
        };
    }
}