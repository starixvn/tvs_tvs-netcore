using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.WrongMarketOffered;

public interface WrongMarketOfferedService
{
    IEnumerable<BetTeamAddRequest> GetBetTeams();

    IEnumerable<BetTeamAddRequestResult> GetBetTypesAdvancedMode(string betTypesAdvancedModeJson);

    Task<IEnumerable<GroupBetTypeModel>> GetGroupBetTypes(int matchId, string betTypeIds);
}

public class WrongMarketOfferedServiceImp : WrongMarketOfferedService
{
    private readonly BetTypesRepository betTypesRepository;

    public WrongMarketOfferedServiceImp(BetTypesRepository betTypesRepository)
    {
        this.betTypesRepository = betTypesRepository;
    }

    public IEnumerable<BetTeamAddRequest> GetBetTeams()
    {
        const string jsonPath = "App_Data/Data/WrongMarketOfferedAdvancedMode.json";
        return Helper.DeserializeJsonFileToObject<WrongMarketOfferedAdvancedMode>(jsonPath).BetTeams;
    }

    public IEnumerable<BetTeamAddRequestResult> GetBetTypesAdvancedMode(string betTypesAdvancedModeJson)
    {
        return Helper.DeserializeObjectIgnoreNullValue<IEnumerable<BetTeamAddRequestResult>>(betTypesAdvancedModeJson);
    }

    public async Task<IEnumerable<GroupBetTypeModel>> GetGroupBetTypes(int matchId, string betTypeIds)
    {
        return (await betTypesRepository.GetGroupBetTypes(betTypeIds, matchId, GameType.SportBook)).GroupBetTypes;
    }
}