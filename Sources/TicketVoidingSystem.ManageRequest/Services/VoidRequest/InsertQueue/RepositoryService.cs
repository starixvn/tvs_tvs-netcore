using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;

public interface RepositoryService
{
    Task<IEnumerable<int>> GetServerInsertQueue(IEnumerable<RequestDetailTicketModel> ticketsInsertQueue);

    Task InsertQueueBySiteDb(int siteDbGroupId, int voidingHistoryId, int requestId, IEnumerable<RequestDetailTicketModel> tickets);

    Task UpdateIsProcessed(InsertQueueQuery query);
}

public class RepositoryServiceImp(IDynamicRepository dynamicRepository, OnlineServerRepository onlineServerRepository,
    SessionService sessionService, MapTicketsService mapTicketsService) : RepositoryService
{
    public async Task<IEnumerable<int>> GetServerInsertQueue(IEnumerable<RequestDetailTicketModel> ticketsInsertQueue)
    {
        var serverIdInTickets = ticketsInsertQueue.Select(x => x.SiteDbGroupId).Distinct();
        var onlineServerId = await onlineServerRepository.GetOnlineServerIdsModel();

        return serverIdInTickets.Where(x => onlineServerId.Any(y => y.Id == x));
    }

    public async Task InsertQueueBySiteDb(int siteDbGroupId, int voidingHistoryId, int requestId, IEnumerable<RequestDetailTicketModel> tickets)
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
        await dynamicRepository.ExecuteAsync(criteria);
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

        await dynamicRepository.ExecuteAsync(criteria);
    }
}