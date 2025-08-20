using AutoMapper;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.Services.OnlineServerRepository;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.PoolHouse;

public interface GetPoolHouseTicketService
{
    Task<GetPoolHouseTicketViewModel> Get(GetPoolHouseTicketQuery query);
}

public class GetPoolHouseTicketServiceImp(IMapper mapper, OnlineServerRepository onlineServerRepository, GeneratePoolHouseTicketService ticketGenerator)
    : GetPoolHouseTicketService
{
    private const string OthersGroupName = "Others";

    public async Task<GetPoolHouseTicketViewModel> Get(GetPoolHouseTicketQuery query)
    {
        var (betTypes, tickets) = await GetPoolHouseTicketAllServer(query);

        var (affectedTickets, otherTickets) = SeparateTickets(tickets);

        return new GetPoolHouseTicketViewModel
        {
            GroupBetTypes = MappingGroupBetType(betTypes),
            AffectedTickets = ticketGenerator.GetTicketsViewModel(affectedTickets, query),
            OtherTickets = ticketGenerator.GetTicketsViewModel(otherTickets, query)
        };
    }

    private async Task<(IEnumerable<BetTypeModel>, IEnumerable<GetTicketModel>)> GetPoolHouseTicketAllServer(GetPoolHouseTicketQuery query)
    {
        var criteria = CreateGetPoolHouseTicketCriteria(query);

        var results = await onlineServerRepository.FetchMultipleAsync<BetTypeModel, GetTicketModel>(criteria);

        return (
            results.Item1.DistinctBy(x => x.Id),
            results.Item2.DistinctBy(x => x.TransId)
        );
    }

    private static (IEnumerable<GetTicketModel> Affected, IEnumerable<GetTicketModel> Others) SeparateTickets(IEnumerable<GetTicketModel> tickets)
    {
        return (
            Affected: tickets.Where(x => x.GroupName != OthersGroupName),
            Others: tickets.Where(x => x.GroupName == OthersGroupName)
        );
    }

    private static IEnumerable<GroupBetTypeModel> MappingGroupBetType(IEnumerable<BetTypeModel> betTypes)
    {
        return betTypes
            .GroupBy(betType => betType.GroupName)
            .Select(group => new GroupBetTypeModel
            {
                GroupName = group.Key,
                BetTypes = [.. group]
            })
            .OrderBy(gr => gr.GroupName);
    }

    private GetPoolHouseTicketCriteria CreateGetPoolHouseTicketCriteria(GetPoolHouseTicketQuery message)
    {
        var criteria = mapper.Map<GetPoolHouseTicketCriteria>(message);
        criteria.WrongOddsInfo = message.WrongOddsInfo?.ToWrongOddsInfoXml();

        return criteria;
    }
}