using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;

public interface InsertQueueService
{
    Task InsertTicketVoidingQueue(InsertQueueQuery query);

    Task UpdateIsProcessed(InsertQueueQuery query);
}

public class InsertQueueServiceImp(
    IDynamicRepository repository,
    SessionService sessionService,
    MapTicketsService mapTicketsService,
    ValidationTicketsService validationTicketsService,
    InsertVoidingHistoryService insertVoidingHistoryService)
    : InsertQueueService
{
    public async Task InsertTicketVoidingQueue(InsertQueueQuery query)
    {
        var ticketsInsertQueue = await validationTicketsService.RecheckTicketsStatus(query);
        var siteGroupInCurrentSessionVoid = ticketsInsertQueue.Select(x => x.SiteDbGroupId).Distinct();
        var broadcastSessionId = Guid.NewGuid().ToString();
        foreach (var siteDbGroupId in siteGroupInCurrentSessionVoid)
        {
            var ticketsInsertQueueInCurrentServer = ticketsInsertQueue.Where(x => x.SiteDbGroupId == siteDbGroupId);
            var transIds = GetTransIdsInsertVoidingHistory(query.IssueTypeId, ticketsInsertQueueInCurrentServer);
            var voidingHistoryId = await insertVoidingHistoryService.InsertVoidingHistory(query, siteDbGroupId, broadcastSessionId, transIds);
            await InsertQueueBySiteDb(siteDbGroupId, voidingHistoryId, query.RequestId, ticketsInsertQueueInCurrentServer);
        }
    }

    private async Task InsertQueueBySiteDb(int siteDbGroupId, int voidingHistoryId, int requestId, IEnumerable<RequestDetailTicketModel> tickets)
    {
        var criteria = new InsertTicketVoidingQueueCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            RequestId = requestId,
            VoidingHistoryId = voidingHistoryId,
            TicketsJson = JsonSerializer.Serialize(tickets),
            UserId = sessionService.UserId,
            IP = sessionService.GetClientIp()
        };
        await repository.ExecuteAsync(criteria);
    }

    public async Task UpdateIsProcessed(InsertQueueQuery query)
    {
        var criteria = new UpdateIsProcessedForRequestTicketsCriteria
        {
            SingleTicketsJson = JsonSerializer.Serialize(mapTicketsService.MapBetIdToRequestDetailTicket(query.SingleTickets, query.RequestId, query.IssueTypeId)),
            ParlayTicketsJson = JsonSerializer.Serialize(mapTicketsService.MapBetIdToRequestDetailTicket(query.ParlayTickets, query.RequestId, query.IssueTypeId)),
            CricketTicketsJson = JsonSerializer.Serialize(mapTicketsService.MapBetIdToRequestDetailTicket(query.CancelCashOutTickets, query.RequestId, query.IssueTypeId)),
            CancelCashOutTicketsJson = JsonSerializer.Serialize(mapTicketsService.MapBetIdToRequestDetailTicket(query.CricketTickets, query.RequestId, query.IssueTypeId))
        };

        await repository.ExecuteAsync(criteria);
    }

    private static string GetTransIdsInsertVoidingHistory(int issueTypeId, IEnumerable<RequestDetailTicketModel> mergeTicketsForInsertQueue)
    {
        if (!mergeTicketsForInsertQueue.Any())
        {
            return null;
        }

        var parlayTableTickets = string.Join(",", mergeTicketsForInsertQueue.Where(x => x.VoidingTypeId is VoidingTypeConstant.Parlay).Select(x => x.TransId));
        var singleTableTickets = string.Join(",", mergeTicketsForInsertQueue.Where(x => x.VoidingTypeId is not VoidingTypeConstant.Parlay).Select(x => x.TransId));

        return issueTypeId.IsWrongMarketOffered()
            ? JsonSerializer.Serialize(new { SingleTransIds = singleTableTickets, ParlayTransIds = parlayTableTickets }) : null;
    }
}