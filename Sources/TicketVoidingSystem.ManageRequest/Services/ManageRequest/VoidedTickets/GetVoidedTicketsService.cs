using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;

public interface GetVoidedTicketsService
{
    Task<IEnumerable<VoidedTicketModel>> GetTickets(GetVoidedTicketsQuery query);

    Task<Match> GetMatchInfo(int matchId);
}

public class GetVoidedTicketsServiceImp : GetVoidedTicketsService
{
    private readonly IDynamicRepository repository;
    private readonly IMapper mapper;

    public GetVoidedTicketsServiceImp(IDynamicRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<IEnumerable<VoidedTicketModel>> GetTickets(GetVoidedTicketsQuery query)
    {
        var voidedTickets = query.IssueTypeId == IssueTypeConstant.ArchivedTicket ? await GetVoidedTickets14(query) : await GetVoidedTickets(query);
        if (query.IsCreditOnly)
        {
            voidedTickets = voidedTickets.Where(x => x.GroupName.Equals("Credit", StringComparison.OrdinalIgnoreCase));
        }

        return voidedTickets.OrderBy(x => x.IsMixParlay).ToList();
    }

    private async Task<IEnumerable<VoidedTicketModel>> GetVoidedTickets(GetVoidedTicketsQuery query)
    {
        var voidedTickets = new List<VoidedTicketModel>();
        var criteria = mapper.Map<GetVoidedTicketsCriteria>(query);
        foreach (var item in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = item.Id;
            var response = await repository.FetchAsync<VoidedTicketModel>(criteria);
            voidedTickets.AddRange(response);
        }

        return voidedTickets;
    }

    private async Task<IEnumerable<VoidedTicketModel>> GetVoidedTickets14(GetVoidedTicketsQuery query)
    {
        var voidedTickets = new List<VoidedTicketModel>();
        var criteria14 = mapper.Map<GetVoidedTickets14Criteria>(query);
        foreach (var item in SiteDbGroupConstant.ServerList)
        {
            criteria14.SiteDbGroupId = item.Id;
            var response = await repository.FetchAsync<VoidedTicketModel>(criteria14);
            voidedTickets.AddRange(response);
        }

        return voidedTickets;
    }

    public async Task<Match> GetMatchInfo(int matchId)
    {
        var criteria = new GetMatchInfoCriteria { MatchId = matchId };
        return await repository.GetAsync<Match>(criteria);
    }
}