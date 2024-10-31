using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Services.BetTypes;

public interface BetTypesRepository
{
    Task<GroupBetTypesViewModel> GetGroupBetTypes(string betTypesHaveTickets, int matchId, byte mode);

    Task<BetTypesViewModel> GetBetTypes(GetBetTypesCriteria criteria);

    Task<GroupBetTypeVirtualSport> GetBetTypesTicketListingVirtualSport(int matchId, string betTypesHaveTickets);

    Task<IEnumerable<int>> GetBetTypesHaveTickets(BetTypeQueryModel query);

    Task<IEnumerable<BetTypeModel>> GetBetTypesHaveTicketsForTvs(int matchId, bool isGetCancelCashOut, DateTime? fromTransDate, DateTime? toTransDate);

    IList<GroupBetTypeVoidParlayVirtualSport> GetVoidParlayVirtualSportsBetTypes();
}

public class BetTypesRepositoryImp : BetTypesRepository
{
    private readonly IDynamicRepository repository;

    public BetTypesRepositoryImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<GroupBetTypesViewModel> GetGroupBetTypes(string betTypesHaveTickets, int matchId, byte mode)
    {
        var criteria = new GetBetTypesCriteria
        {
            MatchId = matchId,
            Mode = mode,
            BetTypes = betTypesHaveTickets
        };

        var betTypes = await GetBetTypes(criteria);

        return new GroupBetTypesViewModel
        {
            Result = betTypes.Result,
            GroupBetTypes = betTypes.Result.IsSuccessful ? betTypes.BetTypes
                    .GroupBy(b => b.GroupName)
                    .Select(group => new GroupBetTypeModel { GroupName = group.Key, BetTypes = group.ToList() })
                    .OrderBy(gr => gr.GroupName)
                    .ToList()
                : new List<GroupBetTypeModel>()
        };
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

    public async Task<GroupBetTypeVirtualSport> GetBetTypesTicketListingVirtualSport(int matchId, string betTypesHaveTickets)
    {
        var criteria = new GetBetTypesTicketListingVirtualSportCriteria
        {
            MatchId = matchId,
            BetTypes = betTypesHaveTickets
        };

        var fullInfoBetTypes = await repository.FetchAsync<BetTypeVirtualSport>(criteria);
        return new GroupBetTypeVirtualSport
        {
            BetTypes = fullInfoBetTypes,
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

        var tasks = SiteDbGroupConstant.ServerList.Select(x =>
        {
            criteria.SiteDbGroupId = x.Id;
            return repository.FetchAsync<int>(criteria);
        });

        var fetchedData = await Task.WhenAll(tasks);
        betTypesInAllServers.AddRange(fetchedData.SelectMany(x => x));

        return betTypesInAllServers.Distinct();
    }

    public async Task<IEnumerable<BetTypeModel>> GetBetTypesHaveTicketsForTvs(int matchId, bool isGetCancelCashOut, DateTime? fromTransDate, DateTime? toTransDate)
    {
        var criteria = new TicketVoidingGetBetTypesHaveTicketsCriteria
        {
            MatchId = matchId,
            IsGetCancelCashOut = isGetCancelCashOut,
            FromTransDate = fromTransDate,
            ToTransDate = toTransDate
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

    public IList<GroupBetTypeVoidParlayVirtualSport> GetVoidParlayVirtualSportsBetTypes()
    {
        const string jsonPath = "App_Data/Data/VoidParlayVirtualSportsBetTypes.json";
        return Helper.DeserializeJsonFileToObject<BetTypesVoidParlayVirtualSport>(jsonPath).Groups;
    }
}