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
        var voidedTickets = await GetTicketsForEachIssueType(query);
        if (query.IsCreditOnly)
        {
            voidedTickets = voidedTickets.Where(x => x.GroupName.Equals("Credit", StringComparison.OrdinalIgnoreCase));
        }

        return voidedTickets.OrderBy(x => x.IsMixParlay).ToList();
    }

    private async Task<IEnumerable<VoidedTicketModel>> GetTicketsForEachIssueType(GetVoidedTicketsQuery query)
    {
        return query.IssueTypeId switch
        {
            IssueTypeConstant.RecoverTicket => await GetRecoveredTickets(query),
            IssueTypeConstant.ArchivedTicket => await GetVoidedTickets14(query),
            _ => await GetVoidedTickets(query)
        };
    }

    private async Task<IEnumerable<VoidedTicketModel>> GetRecoveredTickets(GetVoidedTicketsQuery query)
    {
        var criteria = new GetRecoveredTicketsCriteria
        {
            SingleTransIds = query.SingleTransIds
        };

        var tasks = SiteDbGroupConstant.ServerList
            .Select(item =>
            {
                criteria.SiteDbGroupId = item.Id;
                return repository.FetchAsync<VoidedTicketModel>(criteria);
            });

        var responses = await Task.WhenAll(tasks);
        var recoveredTickets = responses.SelectMany(response => response);

        return recoveredTickets;
    }

    private async Task<IEnumerable<VoidedTicketModel>> GetVoidedTickets(GetVoidedTicketsQuery query)
    {
        var criteria = mapper.Map<GetVoidedTicketsCriteria>(query);

        var tasks = SiteDbGroupConstant.ServerList
            .Select(item =>
            {
                criteria.SiteDbGroupId = item.Id;
                return repository.FetchAsync<VoidedTicketModel>(criteria);
            });

        var responses = await Task.WhenAll(tasks);
        var voidedTickets = responses.SelectMany(response => response);

        return voidedTickets;
    }

    private async Task<IEnumerable<VoidedTicketModel>> GetVoidedTickets14(GetVoidedTicketsQuery query)
    {
        var criteria14 = mapper.Map<GetVoidedTickets14Criteria>(query);

        var tasks = SiteDbGroupConstant.ServerList
            .Select(async item =>
            {
                criteria14.SiteDbGroupId = item.Id;
                return await repository.FetchAsync<VoidedTicketModel>(criteria14);
            });

        var responses = await Task.WhenAll(tasks);
        var voidedTickets = responses.SelectMany(response => response);

        return voidedTickets;
    }

    public async Task<Match> GetMatchInfo(int matchId)
    {
        var criteria = new GetMatchInfoCriteria { MatchId = matchId };
        return await repository.GetAsync<Match>(criteria);
    }
}