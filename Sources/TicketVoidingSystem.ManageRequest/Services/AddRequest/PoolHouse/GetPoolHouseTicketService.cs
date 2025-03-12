using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.PoolHouse;

public interface GetPoolHouseTicketService
{
    Task<GetPoolHouseTicketViewModel> Get(GetPoolHouseTicketQuery query);
}

public class GetPoolHouseTicketServiceImp(IMapper mapper, IDynamicRepository repository, GeneratePoolHouseTicketService generatePoolHouseTicketService)
    : GetPoolHouseTicketService
{
    public async Task<GetPoolHouseTicketViewModel> Get(GetPoolHouseTicketQuery query)
    {
        var (betTypes, tickets) = await GetPoolHouseTicketAllServer(query);
        var affectedTickets = tickets.Where(x => x.GroupName != "Others");
        var otherTickets = tickets.Where(x => x.GroupName is "Others");
        return new GetPoolHouseTicketViewModel
        {
            GroupBetTypes = MappingGroupBetType(betTypes),
            AffectedTickets = generatePoolHouseTicketService.GetTicketsViewModel(affectedTickets, query),
            OtherTickets = generatePoolHouseTicketService.GetTicketsViewModel(otherTickets, query)
        };
    }

    public async Task<(IEnumerable<BetTypeModel>, IEnumerable<GetTicketModel>)> GetPoolHouseTicketAllServer(GetPoolHouseTicketQuery query)
    {
        var criteria = CreateGetPoolHouseTicketCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<BetTypeModel, GetTicketModel>(criteria);
        });
        var results = await Task.WhenAll(tasks);

        return (results.SelectMany(x => x.Item1), results.SelectMany(x => x.Item2));
    }

    private static IEnumerable<GroupBetTypeModel> MappingGroupBetType(IEnumerable<BetTypeModel> betTypes)
    {
        return betTypes
            .GroupBy(b => b.GroupName)
            .Select(group => new GroupBetTypeModel { GroupName = group.Key, BetTypes = group.ToList() })
            .OrderBy(gr => gr.GroupName);
    }

    private GetPoolHouseTicketCriteria CreateGetPoolHouseTicketCriteria(GetPoolHouseTicketQuery message)
    {
        var criteria = mapper.Map<GetPoolHouseTicketCriteria>(message);
        criteria.WrongOddsInfo = message.WrongOddsInfo?.ToWrongOddsInfoXml();

        return criteria;
    }
}