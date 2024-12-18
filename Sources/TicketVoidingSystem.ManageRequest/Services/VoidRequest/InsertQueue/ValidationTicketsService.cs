using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;

public interface ValidationTicketsService
{
    Task<CheckTicketValidationOutput> RecheckTicketsStatus(InsertQueueQuery query, int siteDbGroupId);
}

public class ValidationTicketsServiceImp(IDynamicRepository repository, MapTicketsService mapTicketsService)
    : ValidationTicketsService
{
    public async Task<CheckTicketValidationOutput> RecheckTicketsStatus(InsertQueueQuery query, int siteDbGroupId)
    {
        if (IsIssueTypeNeedToRecheckValidationTickets(query.IssueTypeId))
        {
            return await ReCheckTicketsStatus(CreateTicketTypeModelByQuery(query, siteDbGroupId), siteDbGroupId);
        }

        return CreateTicketTypeModelByQuery(query, siteDbGroupId);
    }

    private CheckTicketValidationOutput CreateTicketTypeModelByQuery(InsertQueueQuery query, int siteDbGroupId)
    {
        return new CheckTicketValidationOutput
        {
            VoidSingleTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.SingleTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            VoidParlayTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.ParlayTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            VoidCricketTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.CricketTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId),
            CancelCOTickets = mapTicketsService.MapBetIdToRequestDetailTicket(query.CancelCashOutTickets.Where(x => x.SiteDbGroupId == siteDbGroupId), query.RequestId, query.IssueTypeId)
        };
    }

    private async Task<CheckTicketValidationOutput> ReCheckTicketsStatus(CheckTicketValidationOutput inputTickets, int siteDbGroupId)  // NOSONAR
    {
        var criteria = new CheckTicketsAllowToVoidCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            SingleTicketsJson = JsonSerializer.Serialize(inputTickets.VoidSingleTickets),
            ParlayTicketsJson = JsonSerializer.Serialize(inputTickets.VoidParlayTickets),
            CricketTicketsJson = JsonSerializer.Serialize(inputTickets.VoidCricketTickets),
            CancelCashOutTicketsJson = JsonSerializer.Serialize(inputTickets.CancelCOTickets)
        };

        var results = (await repository.FetchAsync<RequestDetailTicketModel>(criteria)).ToList();
        var voidSingleTickets = results.Where(x => x.ValidationType == 1);
        var voidParlayTickets = results.Where(x => x.ValidationType == 3);
        var voidCricketTickets = results.Where(x => x.ValidationType == 5);
        var cancelCOTickets = results.Where(x => x.ValidationType == 7);
        var voidSingleTickets14 = results.Where(x => x.ValidationType == 8);
        var voidParlayTickets14 = results.Where(x => x.ValidationType == 9);

        return new CheckTicketValidationOutput
        {
            VoidSingleTickets = voidSingleTickets,
            VoidParlayTickets = voidParlayTickets,
            VoidCricketTickets = voidCricketTickets,
            CancelCOTickets = cancelCOTickets,
            VoidSingleTickets14 = voidSingleTickets14,
            VoidParlayTickets14 = voidParlayTickets14
        };
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