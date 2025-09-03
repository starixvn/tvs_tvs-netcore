using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;

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
    InsertVoidingHistoryService insertVoidingHistoryService,
    OnlineServerRepository onlineServerRepository)
    : InsertQueueService
{
    public async Task InsertTicketVoidingQueue(InsertQueueQuery query)
    {
        var broadcastSessionId = Guid.NewGuid().ToString();
        var ticketsInsertQueue = await validationTicketsService.RecheckTicketsStatus(query);
        var serverInsertQueue = await GetServerInsertQueue(ticketsInsertQueue);
        foreach (var siteDbGroupId in serverInsertQueue)
        {
            var ticketsInsertQueueInCurrentServer = ticketsInsertQueue.Where(x => x.SiteDbGroupId == siteDbGroupId);
            var transIds = GetTransIdsInsertVoidingHistory(query.IssueTypeId, ticketsInsertQueueInCurrentServer);
            var voidingHistoryId = await insertVoidingHistoryService.InsertVoidingHistory(query, siteDbGroupId, broadcastSessionId, transIds);
            await InsertQueueBySiteDb(siteDbGroupId, voidingHistoryId, query.RequestId, ticketsInsertQueueInCurrentServer);
        }
    }

    private async Task<IEnumerable<int>> GetServerInsertQueue(IEnumerable<RequestDetailTicketModel> ticketsInsertQueue)
    {
        var serverIdInTickets = ticketsInsertQueue.Select(x => x.SiteDbGroupId).Distinct();
        var onlineServerId = await onlineServerRepository.GetOnlineServerIdsModel();

        return serverIdInTickets.Where(x => onlineServerId.Any(y => y.Id == x));
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
        if (!mergeTicketsForInsertQueue.Any() || !issueTypeId.IsWrongMarketOffered())
        {
            return null;
        }

        var firstParlayTickets = mergeTicketsForInsertQueue.FirstOrDefault(x => x.VoidingTypeId is VoidingTypeConstant.Parlay)?.TransId;
        var firstSingleTableTickets = mergeTicketsForInsertQueue.FirstOrDefault(x => x.VoidingTypeId is not VoidingTypeConstant.Parlay)?.TransId;

        return JsonSerializer.Serialize(new
        {
            SingleTransIds = firstSingleTableTickets is not null ? firstSingleTableTickets.ToString() : "",
            ParlayTransIds = firstParlayTickets is not null ? firstParlayTickets.ToString() : ""
        });
    }
}