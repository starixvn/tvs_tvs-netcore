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
        if (query.RequestId == 0)
        {
            var TransInfoJsonList = new List<string> { query.TransInfoJson };

            return await GetBetTransTicket(query, TransInfoJsonList);
        }

        var (singleTickets, parlayTickets, cancelCashOutTickets) = await GetTicketsInRequest(query.RequestId);

        if (query.IssueTypeId == IssueTypeConstant.ArchivedTicket)
        {
            var transInfoJsonVoid14List = await getTransInfoService.GetTransInfoJsonForVoid14(singleTickets, parlayTickets);
            return await GetBetTrans14Ticket(query, transInfoJsonVoid14List);
        }

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
        if (query.Match?.MatchId > 0)
        {
            return query.Match.MatchId;
        }

        return null;
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