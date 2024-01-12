using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;

public interface ValidationTicketsService
{
    Task<CheckTicketValidationOutput> RecheckTicketsStatus(InsertQueueQuery query, int siteDbGroupId);
}

public class ValidationTicketsServiceImp : ValidationTicketsService
{
    private readonly IDynamicRepository repository;
    private readonly MapTicketsService mapTicketsService;

    public ValidationTicketsServiceImp(IDynamicRepository repository, MapTicketsService mapTicketsService)
    {
        this.repository = repository;
        this.mapTicketsService = mapTicketsService;
    }

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
        var mappingTypes = new[] {
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel)
        };

        var criteria = new CheckTicketsAllowToVoidCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            SingleTicketsJson = JsonSerializer.Serialize(inputTickets.VoidSingleTickets),
            ParlayTicketsJson = JsonSerializer.Serialize(inputTickets.VoidParlayTickets),
            CricketTicketsJson = JsonSerializer.Serialize(inputTickets.VoidCricketTickets),
            CancelCashOutTicketsJson = JsonSerializer.Serialize(inputTickets.CancelCOTickets)
        };

        var results = await repository.FetchMultipleAsync(criteria, mappingTypes);

        return new CheckTicketValidationOutput
        {
            VoidSingleTickets = results[Number.Zero].Cast<RequestDetailTicketModel>(),
            VoidParlayTickets = results[Number.Two].Cast<RequestDetailTicketModel>(),
            VoidCricketTickets = results[Number.Four].Cast<RequestDetailTicketModel>(),
            CancelCOTickets = results[Number.Six].Cast<RequestDetailTicketModel>(),
            VoidSingleTickets14 = results[Number.Seven].Cast<RequestDetailTicketModel>(),
            VoidParlayTickets14 = results[Number.Eight].Cast<RequestDetailTicketModel>()
        };
    }

    private static bool IsIssueTypeNeedToRecheckValidationTickets(int issueTypeId)
    {
        return new[] { IssueTypeConstant.DangerAccepted, IssueTypeConstant.RedCard, IssueTypeConstant.WrongScore, IssueTypeConstant.AbnormalAccount }.Contains(issueTypeId);
    }
}