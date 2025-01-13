using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;

public interface ValidationTicketsService
{
    Task<IEnumerable<RequestDetailTicketModel>> RecheckTicketsStatus(InsertQueueQuery query);
}

public class ValidationTicketsServiceImp(IDynamicRepository repository, MapTicketsService mapTicketsService)
    : ValidationTicketsService
{
    public async Task<IEnumerable<RequestDetailTicketModel>> RecheckTicketsStatus(InsertQueueQuery query)
    {
        if (IsIssueTypeNeedToRecheckValidationTickets(query.IssueTypeId))
        {
            return await ReCheckTicketsStatus(query);
        }

        return CreateTicketTypeModelByQuery(query);
    }

    private IEnumerable<RequestDetailTicketModel> CreateTicketTypeModelByQuery(InsertQueueQuery query)
    {
        var validationTickets = new CheckTicketValidationOutput
        {
            VoidSingleTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.SingleTickets, query.RequestId, query.IssueTypeId),
            VoidParlayTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.ParlayTickets, query.RequestId, query.IssueTypeId),
            VoidCricketTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.CricketTickets, query.RequestId, query.IssueTypeId),
            CancelCOTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.CancelCashOutTickets, query.RequestId, query.IssueTypeId)
        };
        var ticketsInsertQueue = mapTicketsService.SetVoidingTypeForTickets(validationTickets);

        return ticketsInsertQueue;
    }

    private CheckTicketValidationOutput CreateTicketTypeModelByServer(InsertQueueQuery query, int siteDbGroupId)
    {
        return new CheckTicketValidationOutput
        {
            VoidSingleTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.SingleTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            VoidParlayTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.ParlayTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            VoidCricketTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.CricketTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            CancelCOTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.CancelCashOutTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId)
        };
    }

    private async Task<IEnumerable<RequestDetailTicketModel>> ReCheckTicketsStatus(InsertQueueQuery query)  // NOSONAR
    {
        var results = (await ReCheckTicketsStatusByServer(query)).ToList();
        var voidSingleTickets = results.Where(x => x.ValidationType == 1);
        var voidParlayTickets = results.Where(x => x.ValidationType == 3);
        var voidCricketTickets = results.Where(x => x.ValidationType == 5);
        var cancelCOTickets = results.Where(x => x.ValidationType == 7);
        var voidSingleTickets14 = results.Where(x => x.ValidationType == 8);
        var voidParlayTickets14 = results.Where(x => x.ValidationType == 9);

        var validationTickets = new CheckTicketValidationOutput
        {
            VoidSingleTickets = voidSingleTickets,
            VoidParlayTickets = voidParlayTickets,
            VoidCricketTickets = voidCricketTickets,
            CancelCOTickets = cancelCOTickets,
            VoidSingleTickets14 = voidSingleTickets14,
            VoidParlayTickets14 = voidParlayTickets14
        };

        var ticketsInsertQueue = mapTicketsService.SetVoidingTypeForTickets(validationTickets);

        return ticketsInsertQueue;
    }

    private async Task<IEnumerable<RequestDetailTicketModel>> ReCheckTicketsStatusByServer(InsertQueueQuery query)  // NOSONAR
    {
        var siteGroupInCurrentSessionVoid = query.SingleTickets
            .Union(query.ParlayTickets)
            .Union(query.CancelCashOutTickets)
            .Union(query.CricketTickets)
            .Select(x => x.SiteDbGroupId).Distinct();

        var tasks = siteGroupInCurrentSessionVoid.Select(serverId =>
        {
            var ticketsInCurrentServer = CreateTicketTypeModelByServer(query, serverId);
            var criteria = new CheckTicketsAllowToVoidCriteria
            {
                SiteDbGroupId = serverId,
                SingleTicketsJson = JsonSerializer.Serialize(ticketsInCurrentServer.VoidSingleTickets),
                ParlayTicketsJson = JsonSerializer.Serialize(ticketsInCurrentServer.VoidParlayTickets),
                CricketTicketsJson = JsonSerializer.Serialize(ticketsInCurrentServer.VoidCricketTickets),
                CancelCashOutTicketsJson = JsonSerializer.Serialize(ticketsInCurrentServer.CancelCOTickets)
            };

            return repository.FetchAsync<RequestDetailTicketModel>(criteria);
        });

        var results = await Task.WhenAll(tasks);

        return results.SelectMany(x => x);
    }

    private static bool IsIssueTypeNeedToRecheckValidationTickets(int issueTypeId)
    {
        return new[] {
            IssueTypeConstant.DangerAccepted,
            IssueTypeConstant.RedCard,
            IssueTypeConstant.WrongScore,
            IssueTypeConstant.AbnormalAccount,
            IssueTypeConstant.AbnormalBet,
            IssueTypeConstant.WrongMarketOffered,
            IssueTypeConstant.TechnicalError
        }.Contains(issueTypeId);
    }
}