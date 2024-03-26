using Fanex.Data.Repository;
using SpecialDelete.RecoverByBetId.Criteria;
using SpecialDelete.RecoverByBetId.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverByBetId.Repositories;

public interface Repository
{
    Task<GetTicketsModel> GetTickets(string transIds);

    Task<RecoverTicketsModel> RecoverTickets(IEnumerable<BetId> tickets);
}

public class RepositoryImp : Repository
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;

    public RepositoryImp(IDynamicRepository repository, SessionService sessionService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<GetTicketsModel> GetTickets(string transIds)
    {
        var criteria = CreateGetTicketsCriteria(transIds);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<GetTicketValidation, GetTicketModel>(criteria);
        });
        (IEnumerable<GetTicketValidation> Validation, IEnumerable<GetTicketModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildResultGetTickets(ticketsInAllServers, validationInAllServers);
    }

    public async Task<RecoverTicketsModel> RecoverTickets(IEnumerable<BetId> tickets)
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

        return BuildResultRecoverTickets(ticketsInAllServers, validationInAllServers);
    }

    private static RecoverTicketsModel BuildResultRecoverTickets(IEnumerable<RecoverTicketModel> tickets, IEnumerable<RecoverTicketValidation> validations)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var validation = new RecoverTicketValidation
        {
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty,
            ReCalcMatches = Helper.GetUnionTransIdString(validations.Select(x => x.ReCalcMatches))
        };

        return new RecoverTicketsModel
        {
            Tickets = tickets,
            Validation = validation
        };
    }

    private static GetTicketsModel BuildResultGetTickets(IEnumerable<GetTicketModel> tickets, IEnumerable<GetTicketValidation> validations)
    {
        return new GetTicketsModel
        {
            Tickets = tickets.ToList(),
            InvalidTransIds = Helper.GetIntersectTransIdString(validations.Select(y => y.InvalidTransIds)),
            MovedTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.MovedTransIds))
        };
    }

    private RecoverTicketsCriteria CreateRecoverTicketsCriteria()
    {
        return new RecoverTicketsCriteria
        {
            UserId = sessionService.UserId,
            Ip = sessionService.GetClientIp()
        };
    }

    private static GetTicketsCriteria CreateGetTicketsCriteria(string transIds)
    {
        return new GetTicketsCriteria
        {
            TransIds = transIds
        };
    }
}