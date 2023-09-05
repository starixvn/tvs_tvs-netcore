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
            var voidTicketModel = await GetTicketInsertQueue(query, siteDbGroupId);
            var voidingHistoryId = await insertVoidingHistoryService.InsertVoidingHistory(query, siteDbGroupId, broadcastSessionId);

            await InsertQueueBySiteDb(siteDbGroupId, voidingHistoryId, query.RequestId, voidTicketModel);
        }
    }

    private async Task<TicketTypeModel> GetTicketInsertQueue(InsertQueueQuery query, int siteDbGroupId)
    {
        if (IsIssueTypeNeedToCheckValidationTickets(query.IssueTypeId))
        {
            return await ReCheckTicketsStatus(CreateTicketTypeModelByQuery(query, siteDbGroupId), siteDbGroupId);
        }

        return CreateTicketTypeModelByQuery(query, siteDbGroupId);
    }

    private static TicketTypeModel CreateTicketTypeModelByQuery(InsertQueueQuery query, int siteDbGroupId)
    {
        return new TicketTypeModel
        {
            ValidVoidSingleTickets = CreateTicketModel(query.SingleTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            ValidVoidParlayTickets = CreateTicketModel(query.ParlayTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            ValidVoidCricketTickets = CreateTicketModel(query.CricketTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            ValidCancelCOTickets = CreateTicketModel(query.CancelCashOutTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            ValidVoidSingleTickets14 = Enumerable.Empty<RequestDetailTicketModel>()
        };
    }

    private static bool IsIssueTypeNeedToCheckValidationTickets(int issueTypeId)
    {
        return new[] { IssueTypeConstant.DangerAccepted, IssueTypeConstant.RedCard, IssueTypeConstant.WrongScore, IssueTypeConstant.AbnormalAccount }.Contains(issueTypeId);
    }

    private async Task<TicketTypeModel> ReCheckTicketsStatus(TicketTypeModel ticketTypeModel, int siteDbGroupId)  // NOSONAR
    {
        var mappingTypes = new[] {
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel)
        };

        var results = await repository.FetchMultipleAsync(CreateCheckTicketsAllowToVoidCriteria(ticketTypeModel, siteDbGroupId), mappingTypes);

        return new TicketTypeModel
        {
            ValidVoidSingleTickets = results[0].Cast<RequestDetailTicketModel>(),
            ValidVoidParlayTickets = results[2].Cast<RequestDetailTicketModel>(),
            ValidVoidCricketTickets = results[4].Cast<RequestDetailTicketModel>(),
            ValidCancelCOTickets = results[6].Cast<RequestDetailTicketModel>(),
            ValidVoidSingleTickets14 = results[7].Cast<RequestDetailTicketModel>()
        };
    }

    private static CheckTicketsAllowToVoidCriteria CreateCheckTicketsAllowToVoidCriteria(TicketTypeModel ticketTypeModel, int siteDbGroupId)
    {
        return new CheckTicketsAllowToVoidCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            SingleTicketsJson = JsonSerializer.Serialize(ticketTypeModel.ValidVoidSingleTickets),
            ParlayTicketsJson = JsonSerializer.Serialize(ticketTypeModel.ValidVoidParlayTickets),
            CricketTicketsJson = JsonSerializer.Serialize(ticketTypeModel.ValidVoidCricketTickets),
            CancelCashOutTicketsJson = JsonSerializer.Serialize(ticketTypeModel.ValidCancelCOTickets)
        };
    }

    private static IEnumerable<RequestDetailTicketModel> CreateTicketModel(IEnumerable<BetId>? tickets, int requestId, int issueTypeId)
    {
        return tickets?.Select(x => new RequestDetailTicketModel
        {
            RequestId = requestId,
            TransId = long.Parse(x.TransId),
            MatchId = x.MatchId ?? 0,
            IssueTypeId = issueTypeId
        });
    }

    private async Task InsertQueueBySiteDb(int siteDbGroupId, int voidingHistoryId, int requestId, TicketTypeModel ticketTypeModel)
    {
        var criteria = new InsertTicketVoidingQueueCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            RequestId = requestId,
            VoidingHistoryId = voidingHistoryId,
            SingleTicketsJson = JsonSerializer.Serialize(ticketTypeModel.ValidVoidSingleTickets),
            ParlayTicketsJson = JsonSerializer.Serialize(ticketTypeModel.ValidVoidParlayTickets),
            CricketTicketsJson = JsonSerializer.Serialize(ticketTypeModel.ValidVoidCricketTickets),
            CancelCashOutTicketsJson = JsonSerializer.Serialize(ticketTypeModel.ValidCancelCOTickets),
            SingleTickets14Json = JsonSerializer.Serialize(ticketTypeModel.ValidVoidSingleTickets14),
            UserId = sessionService.UserId,
            IP = sessionService.GetClientIp()
        };
        await repository.ExecuteAsync(criteria);
    }

    public async Task UpdateIsProcessed(InsertQueueQuery query)
    {
        var criteria = new UpdateIsProcessedForRequestTicketsCriteria
        {
            SingleTicketsJson = JsonSerializer.Serialize(CreateTicketModel(query.SingleTickets, query.RequestId, query.IssueTypeId)),
            ParlayTicketsJson = JsonSerializer.Serialize(CreateTicketModel(query.ParlayTickets, query.RequestId, query.IssueTypeId)),
            CricketTicketsJson = JsonSerializer.Serialize(CreateTicketModel(query.CancelCashOutTickets, query.RequestId, query.IssueTypeId)),
            CancelCashOutTicketsJson = JsonSerializer.Serialize(CreateTicketModel(query.CricketTickets, query.RequestId, query.IssueTypeId))
        };

        await repository.ExecuteAsync(criteria);
    }
}