using Fanex.Data.Repository;
using SpecialDelete.RecoverBet.Criteria;
using SpecialDelete.RecoverBet.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverBet.Repositories;

public interface IRepository
{
    Task<GetTicketsModel> GetTickets(string transIds);

    Task<RecoverTicketsModel> RecoverTickets(IEnumerable<BetId> tickets, IEnumerable<BetId> cricketTickets);
}

public class Repository : IRepository
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;

    public Repository(IDynamicRepository repository, SessionService sessionService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<GetTicketsModel> GetTickets(string transIds)
    {
        var tickets = new List<GetTicketModel>();
        var invalidTransIdsViewModel = new List<InvalidTransIds>();
        var validations = new List<GetTicketValidation>();
        var criteria = CreateGetTicketsCriteria(transIds.DistinctWithComma());
        foreach (var serverId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
        {
            criteria.SiteDbGroupId = serverId;
            var (validationSiteDb, ticketsSiteDb) = await repository.FetchMultipleAsync<GetTicketValidation, GetTicketModel>(criteria);
            tickets.AddRange(ticketsSiteDb);
            validations.AddRange(validationSiteDb);
        }

        return BuildResponseGetTickets(invalidTransIdsViewModel, tickets, validations);
    }

    public async Task<RecoverTicketsModel> RecoverTickets(IEnumerable<BetId> tickets, IEnumerable<BetId> cricketTickets)
    {
        var recoverTickets = new List<RecoverTicketModel>();
        var validations = new List<RecoverTicketValidation>();
        var criteria = CreateRecoverTicketsCriteria();
        foreach (var serverId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
        {
            var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == serverId);
            if (!ticketsInSiteDb.Any())
            {
                continue;
            }

            criteria.SiteDbGroupId = serverId;
            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            var (validationSiteDb, recoverTicketsSiteDb) = await repository.FetchMultipleAsync<RecoverTicketValidation, RecoverTicketModel>(criteria);
            recoverTickets.AddRange(recoverTicketsSiteDb);
            validations.AddRange(validationSiteDb);
        }

        return BuildResultRecoverTickets(recoverTickets, validations, cricketTickets);
    }

    private RecoverTicketsCriteria CreateRecoverTicketsCriteria()
    {
        return new RecoverTicketsCriteria
        {
            UserId = sessionService.UserId,
            Ip = sessionService.GetClientIp()
        };
    }

    private static RecoverTicketsModel BuildResultRecoverTickets(IEnumerable<RecoverTicketModel> tickets, IEnumerable<RecoverTicketValidation> validations, IEnumerable<BetId> cricketTickets)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var combineValidation = new RecoverTicketValidation
        {
            AutoReSettledTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.AutoReSettledTransIds)),
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty
        };
        var siteDbExecSuccess = validations.Where(x => x.IsSuccessful).Select(x => x.SiteDbGroupId);
        var ticketsForUpdateNetPosition = cricketTickets?.Where(x => siteDbExecSuccess.Any(siteId => siteId == x.SiteDbGroupId));
        return new RecoverTicketsModel
        {
            Tickets = tickets,
            Validation = combineValidation,
            TicketsForUpdateNetPosition = ticketsForUpdateNetPosition
        };
    }

    private static GetTicketsModel BuildResponseGetTickets(List<InvalidTransIds> invalidTransIdsViewModel, List<GetTicketModel> tickets, IEnumerable<GetTicketValidation> validations)
    {
        var invalidTransIds = Helper.GetIntersectTransIdString(validations.Select(y => y.InvalidTransIds));
        var movedTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.MovedTransIds));
        invalidTransIdsViewModel.AddRange(invalidTransIds.Split(',').Select(x => new InvalidTransIds { InvalidTrans = x, IsMoved = false }));
        invalidTransIdsViewModel.AddRange(movedTransIds.Split(',').Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => new InvalidTransIds { InvalidTrans = x, IsMoved = true }));

        return new GetTicketsModel
        {
            Tickets = tickets,
            InvalidTrans = invalidTransIdsViewModel
        };
    }

    private static GetTicketsCriteria CreateGetTicketsCriteria(string distinctTransIds)
    {
        return new GetTicketsCriteria
        {
            TransIds = distinctTransIds
        };
    }
}