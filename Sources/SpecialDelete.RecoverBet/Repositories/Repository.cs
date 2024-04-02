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
        var invalidTransIdsViewModel = new List<InvalidTransIds>();
        var criteria = CreateGetTicketsCriteria(transIds.DistinctWithComma());
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<GetTicketValidation, GetTicketModel>(criteria);
        });
        (IEnumerable<GetTicketValidation> Validation, IEnumerable<GetTicketModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildResponseGetTickets(invalidTransIdsViewModel, ticketsInAllServers, validationInAllServers);
    }

    public async Task<RecoverTicketsModel> RecoverTickets(IEnumerable<BetId> tickets, IEnumerable<BetId> cricketTickets)
    {
        var criteria = CreateRecoverTicketsCriteria();
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                return Task.FromResult((Enumerable.Empty<RecoverTicketValidation>(), Enumerable.Empty<RecoverTicketModel>()));
            }

            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<RecoverTicketValidation, RecoverTicketModel>(criteria);
        });

        (IEnumerable<RecoverTicketValidation> Validation, IEnumerable<RecoverTicketModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildResultRecoverTickets(ticketsInAllServers, validationInAllServers, cricketTickets);
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

    private static GetTicketsModel BuildResponseGetTickets(List<InvalidTransIds> invalidTransIdsViewModel, IEnumerable<GetTicketModel> tickets, IEnumerable<GetTicketValidation> validations)
    {
        var invalidTransIds = Helper.GetIntersectTransIdString(validations.Select(y => y.InvalidTransIds));
        var movedTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.MovedTransIds));
        invalidTransIdsViewModel.AddRange(invalidTransIds.Split(',').Select(x => new InvalidTransIds { InvalidTrans = x, IsMoved = false }));
        invalidTransIdsViewModel.AddRange(movedTransIds.Split(',').Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => new InvalidTransIds { InvalidTrans = x, IsMoved = true }));

        return new GetTicketsModel
        {
            Tickets = tickets.ToList(),
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