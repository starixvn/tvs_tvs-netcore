using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;

namespace TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

public interface GetTicketsService
{
    Task<IList<GetTicketModel>> GetTickets(GetTicketsQuery query);
}

public class GetTicketsRepositoryImp : GetTicketsService
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;

    public GetTicketsRepositoryImp(IDynamicRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<IList<GetTicketModel>> GetTickets(GetTicketsQuery query)
    {
        var ticketsInAllServers = new List<GetTicketModel>();
        var criteria = CreateGetTicketsCriteria(query);
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var tickets = await repository.FetchAsync<GetTicketModel>(criteria);
            ticketsInAllServers.AddRange(tickets);
        }

        return ticketsInAllServers.OrderBy(x => x.IsMixParlay).ToList();
    }

    private GetTicketsCriteria CreateGetTicketsCriteria(GetTicketsQuery query)
    {
        var criteria = mapper.Map<GetTicketsCriteria>(query);
        criteria.SecondAcceptFlag = query.TicketType;
        criteria.LiveIndicator = query.EventType;
        criteria.FromTransDate = query.FromTransDate.ZoneCanada();
        criteria.ToTransDate = query.ToTransDate.ZoneCanada();
        criteria.BetTypes = query.BetTypes.ToBetTypeXml();

        return criteria;
    }
}