using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.SharedApi.Services.BetTypes
{
    public interface BetTypesRepository
    {
        Task<BetTypesViewModel> GetBetTypes(GetBetTypesCriteria criteria);

        Task<IEnumerable<int>> GetBetTypesHaveTickets(BetTypeQueryModel query);
    }

    public class BetTypesRepositoryImp : BetTypesRepository
    {
        private readonly IDynamicRepository repository;

        public BetTypesRepositoryImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<BetTypesViewModel> GetBetTypes(GetBetTypesCriteria criteria)
        {
            var betTypes = await repository.FetchAsync<BetTypeModel>(criteria);
            return new BetTypesViewModel
            {
                Betypes = betTypes,
                Result = new Result
                {
                    ErrorCode = criteria.ErrCode,
                    ErrorMsg = criteria.ErrMsg
                }
            };
        }

        public async Task<IEnumerable<int>> GetBetTypesHaveTickets(BetTypeQueryModel query)
        {
            var betTypesInAllServers = new List<int>();
            var criteria = new GetBetTypesHaveTicketsCriteria
            {
                MatchId = query.MatchId,
                Mode = query.Mode
            };

            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                criteria.SiteDbGroupId = server.Id;
                var betTypes = await repository.FetchAsync<int>(criteria);

                betTypesInAllServers.AddRange(betTypes);
            }

            return betTypesInAllServers.Distinct();
        }
    }
}