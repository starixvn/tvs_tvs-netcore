using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.SharedApi.Services.BetTypes;

public interface BetTypesRepository
{
    Task<BetTypesViewModel> GetBetTypes(GetBetTypesCriteria criteria);

    Task<IEnumerable<int>> GetBetTypesHaveTickets(BetTypeQueryModel query);

    Task<IEnumerable<BetTypeModel>> GetBetTypesHaveTicketsForTvs(int matchId);
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
            BetTypes = betTypes,
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

    public async Task<IEnumerable<BetTypeModel>> GetBetTypesHaveTicketsForTvs(int matchId)
    {
        var criteria = new TicketVoidingGetBetTypesHaveTicketsCriteria
        {
            MatchId = matchId
        };
        var betTypesAllServers = new List<BetTypeModel>();
        var fetchTasks = SiteDbGroupConstant.ServerList
            .Select(server => FetchDataAsync(server.Id, criteria));
        var fetchedData = await Task.WhenAll(fetchTasks);

        betTypesAllServers.AddRange(fetchedData.SelectMany(x => x));

        return betTypesAllServers;
    }

    private async Task<IEnumerable<BetTypeModel>> FetchDataAsync(int siteDbGroupId, TicketVoidingGetBetTypesHaveTicketsCriteria criteria)
    {
        criteria.SiteDbGroupId = siteDbGroupId;
        return await repository.FetchAsync<BetTypeModel>(criteria);
    }
}