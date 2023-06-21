using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface GetTicketsService
{
    Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query);
}

public class GetTicketsServiceImp : GetTicketsService
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly GetTransInfoService getTransInfoService;

    public GetTicketsServiceImp(IMapper mapper, IDynamicRepository repository, GetTransInfoService getTransInfoService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.getTransInfoService = getTransInfoService;
    }

    public async Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query)
    {
        switch (query.IssueTypeId)
        {
            case IssueTypeConstant.EarlyKickOffTime:
            case IssueTypeConstant.WrongKickOffTime:
                return await GetTicketsIssueTypeEarlyKickOffOrWrongKickOff(query);

            case IssueTypeConstant.ArchivedTicket:
                return await GetTicketsIssueTypeArchivedTicket(query);

            case IssueTypeConstant.AbnormalAccount:
                return await GetTicketsIssueTypeAbnormalAccount(query);

            default:
                return await GetTicketsDefault(query);
        }
    }

    private async Task<IEnumerable<GetTicketModel>> GetTicketsIssueTypeAbnormalAccount(GetTicketsQuery query)
    {
        var (singleTickets, parlayTickets, cancelCashOutTickets) = await GetTicketsInRequest(query.RequestId);
        var transInfoJsonVoid14List = await getTransInfoService.GetTransInfoJsonForVoid14(singleTickets);
        var transInfoJsonList = await getTransInfoService.GetTransInfoJsonForVoid(singleTickets, parlayTickets, cancelCashOutTickets, GetMatchIdForQueryTransInfoJson(query));
        var void14Tickets = await GetBetTrans14Ticket(query, transInfoJsonVoid14List);
        var voidBetTransTickets = await GetBetTransTicket(query, transInfoJsonList);

        return void14Tickets.Union(voidBetTransTickets);
    }

    private async Task<IEnumerable<GetTicketModel>> GetTicketsIssueTypeArchivedTicket(GetTicketsQuery query)
    {
        var (singleTickets, _, _) = await GetTicketsInRequest(query.RequestId);
        var transInfoJsonVoid14List = await getTransInfoService.GetTransInfoJsonForVoid14(singleTickets);

        return await GetBetTrans14Ticket(query, transInfoJsonVoid14List);
    }

    private async Task<IEnumerable<GetTicketModel>> GetTicketsIssueTypeEarlyKickOffOrWrongKickOff(GetTicketsQuery query)
    {
        if (query.RequestId == 0) // get tickets when add/edit request
        {
            var transInfoJson = new List<string> { query.TransInfoJson };
            return await GetBetTransTicket(query, transInfoJson);
        }

        var (singleTickets, parlayTickets, cancelCashOutTickets) = await GetTicketsInRequest(query.RequestId);
        var transInfoJsonList = await getTransInfoService.GetTransInfoJsonForVoid(singleTickets, parlayTickets, cancelCashOutTickets, GetMatchIdForQueryTransInfoJson(query));

        return await GetBetTransTicket(query, transInfoJsonList);
    }

    private async Task<IEnumerable<GetTicketModel>> GetTicketsDefault(GetTicketsQuery query)
    {
        var (singleTickets, parlayTickets, cancelCashOutTickets) = await GetTicketsInRequest(query.RequestId);
        var transInfoJsonList = await getTransInfoService.GetTransInfoJsonForVoid(singleTickets, parlayTickets, cancelCashOutTickets, GetMatchIdForQueryTransInfoJson(query));

        return await GetBetTransTicket(query, transInfoJsonList);
    }

    private async Task<IEnumerable<GetTicketModel>> GetBetTransTicket(GetTicketsQuery query, IEnumerable<string> transInfoJsonList)
    {
        var criteria = mapper.Map<GetTicketsCriteria>(query);
        criteria.BetTypes = query.BetTypes.ToXml();
        criteria.MatchId = query.Match?.MatchId ?? 0;
        criteria.TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));

        var tickets = await repository.FetchAsync<GetTicketModel>(criteria);
        return tickets.OrderBy(x => x.IsMixParlay);
    }

    private async Task<IEnumerable<GetTicketModel>> GetBetTrans14Ticket(GetTicketsQuery query, IEnumerable<string> transInfoJsonList)
    {
        var criteria = mapper.Map<GetBetTrans14TicketsCriteria>(query);
        criteria.TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));
        var tickets = await repository.FetchAsync<GetTicketModel>(criteria);

        return tickets.OrderBy(x => x.IsMixParlay);
    }

    private static int? GetMatchIdForQueryTransInfoJson(GetTicketsQuery query)
    {
        return (query.Match?.MatchId > 0) ? query.Match.MatchId : null;
    }

    private async Task<(IEnumerable<BetId> SingleTickets, IEnumerable<BetId> ParlayTickets, IEnumerable<BetId> CancelCashOutTickets)> GetTicketsInRequest(int requestId)
    {
        var criteria = new GetTicketInRequestCriteria
        {
            RequestId = requestId
        };

        return await repository.FetchMultipleAsync<BetId, BetId, BetId>(criteria);
    }
}