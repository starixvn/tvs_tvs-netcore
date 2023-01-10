using System.Collections.Generic;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Services.BetTypes
{
    public interface BetTeamsService
    {
        IEnumerable<BetTeam> Get();
    }

    public class BetTeamsServiceImp : BetTeamsService
    {
        public IEnumerable<BetTeam> Get()
        {
            const string jsonPath = "App_Data/Data/AdvancedMode.json";
            return Helper.DeserializeJsonFileToObject<AdvancedMode>(jsonPath).BetTeams;
        }
    }
}