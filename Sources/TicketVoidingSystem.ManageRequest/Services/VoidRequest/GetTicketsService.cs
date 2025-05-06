using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface GetTicketsService
{
    Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query);
}

public class GetTicketsServiceImp(IMapper mapper, IDynamicRepository repository)
    : GetTicketsService
{
    public async Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query)
    {
        var tickets = query.IssueTypeId switch
        {
            IssueTypeConstant.ArchivedTicket
                => await GetBetTrans14Ticket(query),
            IssueTypeConstant.AbnormalAccount or IssueTypeConstant.AbnormalBet
                => await GetTicketsRangeActiveAndBackup(query),
            _ => await GetBetTransTicket(query)
        };

        return tickets.OrderBy(x => x.GroupId).ThenBy(x => x.TransId);
    }

    private async Task<IEnumerable<GetTicketModel>> GetTicketsRangeActiveAndBackup(GetTicketsQuery query)
    {
        var void14Tickets = await GetBetTrans14Ticket(query);
        var voidBetTransTickets = await GetBetTransTicket(query);

        return void14Tickets.Union(voidBetTransTickets);
    }

    private async Task<IEnumerable<GetTicketModel>> GetBetTransTicket(GetTicketsQuery query)
    {
        var criteria = mapper.Map<GetTicketsCriteria>(query);
        criteria.MatchId = query.Match?.MatchId ?? 0;

        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchAsync<GetTicketModel>(criteria);
        });

        var tickets = await Task.WhenAll(tasks);
        return tickets.SelectMany(x => x).OrderBy(x => x.IsMixParlay);
    }

    private async Task<IEnumerable<GetTicketModel>> GetBetTrans14Ticket(GetTicketsQuery query)
    {
        var criteria = mapper.Map<GetBetTrans14TicketsCriteria>(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchAsync<GetTicketModel>(criteria);
        });

        var tickets = await Task.WhenAll(tasks);
        return tickets.SelectMany(x => x).OrderBy(x => x.IsMixParlay);
    }
}