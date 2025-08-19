using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface GetTicketsService
{
    Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query);
}

public class GetTicketsServiceImp(IMapper mapper, OnlineServerRepository onlineServerRepository)
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
        var currentOnlineServerId = await onlineServerRepository.GetOnlineServerIds();
        var criteria = mapper.Map<GetTicketsCriteria>(query);
        criteria.MatchId = query.Match?.MatchId ?? 0;
        criteria.OnlineServerId = currentOnlineServerId;

        var tickets = await onlineServerRepository.FetchAsync<GetTicketModel>(criteria);

        return tickets.OrderBy(x => x.IsMixParlay);
    }

    private async Task<IEnumerable<GetTicketModel>> GetBetTrans14Ticket(GetTicketsQuery query)
    {
        var currentOnlineServerId = await onlineServerRepository.GetOnlineServerIds();
        var criteria = mapper.Map<GetBetTrans14TicketsCriteria>(query);
        criteria.OnlineServerId = currentOnlineServerId;
        var tickets = await onlineServerRepository.FetchAsync<GetTicketModel>(criteria);

        return tickets.OrderBy(x => x.IsMixParlay);
    }
}