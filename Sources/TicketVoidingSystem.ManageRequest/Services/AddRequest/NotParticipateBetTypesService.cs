using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface NotParticipateBetTypesService
{
    Task<NotParticipateBetTypesViewModel> GetNotParticipateBetType(int matchId);
}

public class NotParticipateBetTypesServiceImp(
    BetTypesRepository betTypesRepository,
    IDynamicRepository dynamicRepository)
    : NotParticipateBetTypesService
{
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

    public async Task<IEnumerable<OddsInfoViewModel>> GetPlayerHaveTickets(IEnumerable<NotParticipateBetTypesModel> notParticipateBetTypesHaveTicket, int matchId)
    {
        var criteria = new GetOddsInfoCriteria
        {
            MatchId = matchId,
            BetTypes = string.Join(",", notParticipateBetTypesHaveTicket.Select(x => x.BetTypeId))
        };

        return await dynamicRepository.FetchAsync<OddsInfoViewModel>(criteria);
    }

    public async Task<IEnumerable<NotParticipateBetTypesModel>> GetNotParticipateBetTypesHavesTickets(IEnumerable<NotParticipateBetTypesModel> betTypes, int matchId)
    {
        var allBetTypesOfMatch = await betTypesRepository.GetBetTypesHaveTicketsForTvs(matchId, false, null, null);
        var results = allBetTypesOfMatch
            .DistinctBy(x => new { x.Id, x.TransDesc })
            .Where(x => betTypes.Any(t => t.BetTypeId == int.Parse(x.Id)))
            .Select(x =>
            {
                var betTypeModel = betTypes.First(y => y.BetTypeId == int.Parse(x.Id));
                return new NotParticipateBetTypesModel
                {
                    BetTypeId = int.Parse(x.Id),
                    BetTypeName = x.Name,
                    PlayerId = int.TryParse(x.TransDesc, out var outValue) ? (int?)outValue : default,
                    ParentId = betTypeModel.ParentId,
                    ParentName = GetGroupName(betTypeModel.ParentId)
                };
            });

        return results;
    }

    private static string GetGroupName(int parentId)
    {
        return parentId switch
        {
            Number.One => "1 Inns",
            Number.Two => "2 Inns",
            Number.Three => "FT",
            _ => string.Empty
        };
    }
}