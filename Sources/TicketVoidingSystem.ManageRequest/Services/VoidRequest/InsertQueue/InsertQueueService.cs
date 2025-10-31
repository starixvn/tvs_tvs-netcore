using System.Text.Json;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SignalR;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;

public interface InsertQueueService
{
    Task InsertTicketVoidingQueue(InsertQueueQuery query);
}

public class InsertQueueServiceImp(
    RepositoryService repositoryService,
    ValidationTicketsService validationTicketsService,
    InsertVoidingHistoryService insertVoidingHistoryService,
    NotificationSignalRService signalRService)
    : InsertQueueService
{
    public async Task InsertTicketVoidingQueue(InsertQueueQuery query)
    {
        var broadcastSessionId = Guid.NewGuid().ToString();
        var ticketsInsertQueue = await validationTicketsService.RecheckTicketsStatus(query);
        var serverInsertQueue = await repositoryService.GetServerInsertQueue(ticketsInsertQueue);
        foreach (var siteDbGroupId in serverInsertQueue)
        {
            var ticketsInsertQueueInCurrentServer = ticketsInsertQueue.Where(x => x.SiteDbGroupId == siteDbGroupId);
            var transIds = GetTransIdsInsertVoidingHistory(query.IssueTypeId, ticketsInsertQueueInCurrentServer);
            var voidingHistoryId = await insertVoidingHistoryService.InsertVoidingHistory(query, siteDbGroupId, broadcastSessionId, transIds);
            await repositoryService.InsertQueueBySiteDb(siteDbGroupId, voidingHistoryId, query.RequestId, ticketsInsertQueueInCurrentServer);
        }
        await UpdateStatusRequest(query.RequestId, serverInsertQueue);
    }

    private static string GetTransIdsInsertVoidingHistory(int issueTypeId, IEnumerable<RequestDetailTicketModel> mergeTicketsForInsertQueue)
    {
        if (!mergeTicketsForInsertQueue.Any() || !issueTypeId.IsWrongMarketOffered())
        {
            return null;
        }

        var firstParlayTickets = mergeTicketsForInsertQueue.FirstOrDefault(x => IsVoidingTypeParlay(x.VoidingTypeId))?.TransId;
        var firstSingleTableTickets = mergeTicketsForInsertQueue.FirstOrDefault(x => !IsVoidingTypeParlay(x.VoidingTypeId))?.TransId;

        return JsonSerializer.Serialize(new
        {
            SingleTransIds = firstSingleTableTickets is not null ? firstSingleTableTickets.ToString() : "",
            ParlayTransIds = firstParlayTickets is not null ? firstParlayTickets.ToString() : ""
        });
    }

    private static bool IsVoidingTypeParlay(int voidingTypeId)
    {
        int[] voidingTypeParlay = [VoidingTypeConstant.Parlay, VoidingTypeConstant.HybridParlay, VoidingTypeConstant.SubHybridParlay, VoidingTypeConstant.HybridParlay14];
        return voidingTypeParlay.Contains(voidingTypeId);
    }

    private async Task UpdateStatusRequest(int requestId, IEnumerable<int> serverInsertQueue)
    {
        var requestStatus = new List<RequestStatus>
        {
            new()
            {
                RequestId = requestId,
                Status = serverInsertQueue.Any() ? "Running" : "Failed"
            }
        };
        await signalRService.UpdateRequestStatusToAllUser(requestStatus);
    }
}