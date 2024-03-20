using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Services.BetTypes;

public interface BetTeamsService
{
    IEnumerable<BetTeam> Get();
}

public class BetTeamsServiceImp : BetTeamsService
{
    public IEnumerable<BetTeam> Get()
    {
        const string jsonPath = "App_Data/Data/AdvancedMode.json";
        var betTeams = Helper.DeserializeJsonFileToObject<AdvancedMode>(jsonPath).BetTeams;
        const string jsonPathCricketsBettypes = "App_Data/Data/CricketBetTypesAdvancedMode.json";
        var betTeamCrickets = Helper.DeserializeJsonFileToObject<AdvancedMode>(jsonPathCricketsBettypes).BetTeams;

        return betTeams.Concat(betTeamCrickets);
    }
}