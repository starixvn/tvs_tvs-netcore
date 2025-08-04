using TicketVoidingSystem.Constants;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface AdvancedModeService
{
    IEnumerable<BetTeamAddRequest> GetBetTeams();

    IEnumerable<BetTeamAddRequestResult> GetBetTypesAdvancedMode(string betTypesAdvancedModeJson);

    Task<IEnumerable<GroupBetTypeModel>> GetGroupBetTypes(int matchId, string betTypeIds);

    IEnumerable<AllBetTypesSelection> GetAllBetTypesSelection(string allBetTypesSelectionJson);
}

public class AdvancedModeServiceImp(BetTypesRepository betTypesRepository) : AdvancedModeService
{
    public IEnumerable<BetTeamAddRequest> GetBetTeams()
    {
        const string jsonPath = "App_Data/Data/AddRequestAdvancedMode.json";
        return Helper.DeserializeJsonFileToObject<AdvancedModeAddRequestModel>(jsonPath).BetTeams;
    }

    public IEnumerable<BetTeamAddRequestResult> GetBetTypesAdvancedMode(string betTypesAdvancedModeJson)
    {
        return Helper.DeserializeObjectIgnoreNullValue<IEnumerable<BetTeamAddRequestResult>>(betTypesAdvancedModeJson);
    }

    public async Task<IEnumerable<GroupBetTypeModel>> GetGroupBetTypes(int matchId, string betTypeIds)
    {
        return (await betTypesRepository.GetGroupBetTypes(betTypeIds, matchId, GameType.SportBook)).GroupBetTypes;
    }

    public IEnumerable<AllBetTypesSelection> GetAllBetTypesSelection(string allBetTypesSelectionJson)
    {
        return string.IsNullOrWhiteSpace(allBetTypesSelectionJson)
            ? []
            : Helper.DeserializeObjectIgnoreNullValue<IEnumerable<AllBetTypesSelection>>(allBetTypesSelectionJson);
    }
}