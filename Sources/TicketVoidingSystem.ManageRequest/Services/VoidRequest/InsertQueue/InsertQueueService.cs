using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;

public interface InsertQueueService
{
    Task InsertTicketVoidingQueue(InsertQueueQuery query);

    Task UpdateIsProcessed(InsertQueueQuery query);
}

public class InsertQueueServiceImp : InsertQueueService
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly MapTicketsService mapTicketsService;
    private readonly ValidationTicketsService validationTicketsService;
    private readonly InsertVoidingHistoryService insertVoidingHistoryService;

    public InsertQueueServiceImp(IDynamicRepository repository, SessionService sessionService, MapTicketsService mapTicketsService,
        ValidationTicketsService validationTicketsService, InsertVoidingHistoryService insertVoidingHistoryService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.mapTicketsService = mapTicketsService;
        this.validationTicketsService = validationTicketsService;
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
            var validationTickets = await validationTicketsService.RecheckTicketsStatus(query, siteDbGroupId);
            var mergeTicketsForInsertQueue = mapTicketsService.SetVoidingTypeForTickets(validationTickets);
            var voidingHistoryId = await insertVoidingHistoryService.InsertVoidingHistory(query, siteDbGroupId, broadcastSessionId);
            await InsertQueueBySiteDb(siteDbGroupId, voidingHistoryId, query.RequestId, mergeTicketsForInsertQueue);
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
}