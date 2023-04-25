using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface InsertQueueService
{
    Task InsertTicketVoidingQueue(InsertQueueQuery query);

    Task UpdateIsProcessed(InsertQueueQuery query);
}

public class InsertQueueServiceImp : InsertQueueService
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly InsertVoidingHistoryService insertVoidingHistoryService;

    public InsertQueueServiceImp(IDynamicRepository repository, SessionService sessionService, InsertVoidingHistoryService insertVoidingHistoryService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.insertVoidingHistoryService = insertVoidingHistoryService;
    }

    public async Task InsertTicketVoidingQueue(InsertQueueQuery query)
    {
        var siteGroupInCurrentSessionVoid = query.SingleTickets
            .Union(query.ParlayTickets)
            .Union(query.CancelCashOutTickets)
            .Union(query.CricketTickets)
            .Select(x => x.SiteDbGroupId).Distinct();

        var broadcastSessionId = Guid.NewGuid().ToString();
        foreach (var siteDbGroupId in siteGroupInCurrentSessionVoid)
        {
            var singleTickets = CreateTicketModel(query.SingleTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId);
            var parlayTickets = CreateTicketModel(query.ParlayTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId);
            var cricketTickets = CreateTicketModel(query.CricketTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId);
            var cancelCashOutTickets = CreateTicketModel(query.CancelCashOutTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId);

            if (IsIssueTypeHaveCancelCoTickets(query.IssueTypeId))
            {
                (singleTickets, parlayTickets, cricketTickets, cancelCashOutTickets)
                    = await ReCheckTicketsStatus(siteDbGroupId, singleTickets, parlayTickets, cricketTickets, cancelCashOutTickets);
            }

            var voidingHistoryId = await insertVoidingHistoryService.InsertVoidingHistory(query, siteDbGroupId, broadcastSessionId);

            await InsertQueueBySiteDb(siteDbGroupId, voidingHistoryId, query.RequestId, singleTickets, parlayTickets, cricketTickets, cancelCashOutTickets);
        }
    }

    private static bool IsIssueTypeHaveCancelCoTickets(int issueTypeId)
    {
        return new[] { IssueTypeConstant.DangerAccepted, IssueTypeConstant.RedCard, IssueTypeConstant.WrongScore }.Contains(issueTypeId);
    }

    private async Task<(IEnumerable<RequestDetailTicketModel> SingleTickets, IEnumerable<RequestDetailTicketModel> ParlayTickets,
            IEnumerable<RequestDetailTicketModel> CricketTickets, IEnumerable<RequestDetailTicketModel> CancelCashOutTickets)>
        ReCheckTicketsStatus(int siteDbGroupId, IEnumerable<RequestDetailTicketModel> singleTickets, IEnumerable<RequestDetailTicketModel> parlayTickets,
        IEnumerable<RequestDetailTicketModel> cricketTickets, IEnumerable<RequestDetailTicketModel> cancelCashOutTickets)
    {
        var criteria = new CheckTicketsAllowToVoidCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            SingleTicketsJson = JsonSerializer.Serialize(singleTickets),
            ParlayTicketsJson = JsonSerializer.Serialize(parlayTickets),
            CricketTicketsJson = JsonSerializer.Serialize(cricketTickets),
            CancelCashOutTicketsJson = JsonSerializer.Serialize(cancelCashOutTickets)
        };

        var mappingTypes = new[] { typeof(RequestDetailTicketModel), typeof(RequestDetailTicketModel), typeof(RequestDetailTicketModel),
                typeof(RequestDetailTicketModel), typeof(RequestDetailTicketModel), typeof(RequestDetailTicketModel), typeof(RequestDetailTicketModel) };

        var result = await repository.FetchMultipleAsync(criteria, mappingTypes);
        var validVoidSingleTickets = result[0].Cast<RequestDetailTicketModel>();
        var validVoidParlayTickets = result[2].Cast<RequestDetailTicketModel>();
        var validVoidCricketTickets = result[4].Cast<RequestDetailTicketModel>();
        var validCancelCashOutTickets = result[6].Cast<RequestDetailTicketModel>();

        return (validVoidSingleTickets, validVoidParlayTickets, validVoidCricketTickets, validCancelCashOutTickets);
    }

    private static IEnumerable<RequestDetailTicketModel> CreateTicketModel(IEnumerable<BetId> tickets, int requestId, int issueTypeId)
    {
        return tickets.Select(x => new RequestDetailTicketModel
        {
            RequestId = requestId,
            TransId = long.Parse(x.TransId),
            MatchId = x.MatchId ?? 0,
            IssueTypeId = issueTypeId
        });
    }

    private async Task InsertQueueBySiteDb(int siteDbGroupId, int voidingHistoryId, int requestId,
        IEnumerable<RequestDetailTicketModel> singleTickets, IEnumerable<RequestDetailTicketModel> parlayTickets,
        IEnumerable<RequestDetailTicketModel> cricketTickets, IEnumerable<RequestDetailTicketModel> cancelCashOutTickets)
    {
        var criteria = new InsertTicketVoidingQueueCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            RequestId = requestId,
            VoidingHistoryId = voidingHistoryId,
            SingleTicketsJson = JsonSerializer.Serialize(singleTickets),
            ParlayTicketsJson = JsonSerializer.Serialize(parlayTickets),
            CricketTicketsJson = JsonSerializer.Serialize(cricketTickets),
            CancelCashOutTicketsJson = JsonSerializer.Serialize(cancelCashOutTickets),
            UserId = sessionService.UserId,
            IP = sessionService.GetClientIp(),
        };
        await repository.ExecuteAsync(criteria);
    }

    public async Task UpdateIsProcessed(InsertQueueQuery query)
    {
        var singleTickets = CreateTicketModel(query.SingleTickets, query.RequestId, query.IssueTypeId);
        var parlayTickets = CreateTicketModel(query.ParlayTickets, query.RequestId, query.IssueTypeId);
        var cancelCashOutTickets = CreateTicketModel(query.CancelCashOutTickets, query.RequestId, query.IssueTypeId);
        var cricketTickets = CreateTicketModel(query.CricketTickets, query.RequestId, query.IssueTypeId);
        var criteria = new UpdateIsProcessedForRequestTicketsCriteria
        {
            SingleTicketsJson = JsonSerializer.Serialize(singleTickets),
            ParlayTicketsJson = JsonSerializer.Serialize(parlayTickets),
            CricketTicketsJson = JsonSerializer.Serialize(cricketTickets),
            CancelCashOutTicketsJson = JsonSerializer.Serialize(cancelCashOutTickets)
        };

        await repository.ExecuteAsync(criteria);
    }
}