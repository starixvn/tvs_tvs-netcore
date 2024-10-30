using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface AdvancedModeService
{
    IEnumerable<BetTeamAddRequest> GetBetTeams();

    IEnumerable<BetTeamAddRequestResult> GetBetTypesAdvancedMode(string betTypesAdvancedModeJson);

    Task<IEnumerable<GroupBetTypeModel>> GetGroupBetTypes(int matchId, string betTypeIds);

    IEnumerable<ControlsAllBetTypes> GetControlsAllBetTypes(string controlsAllBetTypesJson);
}

public class AdvancedModeServiceImp : AdvancedModeService
{
    private readonly BetTypesRepository betTypesRepository;

    public AdvancedModeServiceImp(BetTypesRepository betTypesRepository)
    {
        this.betTypesRepository = betTypesRepository;
    }

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

    public IEnumerable<ControlsAllBetTypes> GetControlsAllBetTypes(string controlsAllBetTypesJson)
    {
        return string.IsNullOrWhiteSpace(controlsAllBetTypesJson) ? null : Helper.DeserializeObjectIgnoreNullValue<IEnumerable<ControlsAllBetTypes>>(controlsAllBetTypesJson);
    }
}