using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Services.BetTypes
{
    public interface BetTypesService
    {
        Task<BetTypesViewModel> GetBetTypes(GetBetTypesCriteria criteria);

        Task<GroupBetTypesViewModel> GetGroupBetTypes(BetTypeQueryModel query);

        IList<GroupBetTypeVirtualSport> GetVirtualSports();
    }

    public class BetTypesServiceImp : BetTypesService
    {
        private readonly BetTypesRepository repository;

        public BetTypesServiceImp(BetTypesRepository repository)
        {
            this.repository = repository;
        }

        public async Task<GroupBetTypesViewModel> GetGroupBetTypes(BetTypeQueryModel query)
        {
            var betTypesHaveTickets = string.IsNullOrEmpty(query.BetTypes)
                                        ? string.Join(",", await GetBetTypesHaveTickets(query))
                                        : query.BetTypes;

            var criteria = new GetBetTypesCriteria
            {
                MatchId = query.MatchId,
                Mode = query.Mode,
                BetTypes = betTypesHaveTickets
            };

            var betTypes = await repository.GetBetTypes(criteria);

            return new GroupBetTypesViewModel
            {
                Result = betTypes.Result,
                GroupBetTypes = betTypes.Result.IsSuccessful ? betTypes.Betypes
                    .GroupBy(b => b.GroupName)
                    .Select(group => new GroupBetTypeModel { GroupName = group.Key, BetTypes = group.ToList() })
                    .OrderBy(gr => gr.GroupName)
                    .ToList()
                    : new List<GroupBetTypeModel>()
            };
        }

        public async Task<BetTypesViewModel> GetBetTypes(GetBetTypesCriteria criteria)
        {
            return await repository.GetBetTypes(criteria);
        }

        public async Task<IEnumerable<int>> GetBetTypesHaveTickets(BetTypeQueryModel query)
        {
            return await repository.GetBetTypesHaveTickets(query);
        }

        public IList<GroupBetTypeVirtualSport> GetVirtualSports()
        {
            const string jsonPath = "App_Data/Data/VirtualSportsBetTypes.json";
            return Helper.DeserializeJsonFileToObject<BetTypesArea>(jsonPath).Groups;
        }
    }
}