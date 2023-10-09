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
        var tickets = new List<GetTicketModel>();
        var validations = new List<GetTicketValidation>();
        var criteria = CreateGetTicketsCriteria(transIds);
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var (validationSiteDb, ticketsSiteDb) = await repository.FetchMultipleAsync<GetTicketValidation, GetTicketModel>(criteria);
            tickets.AddRange(ticketsSiteDb);
            validations.AddRange(validationSiteDb);
        }

        return BuildResultGetTickets(tickets, validations);
    }

    public async Task<RecoverTicketsModel> RecoverTickets(IEnumerable<BetId> tickets)
    {
        var validations = new List<RecoverTicketValidation>();
        var recoverTickets = new List<RecoverTicketModel>();
        var criteria = CreateRecoverTicketsCriteria();
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                continue;
            }

            criteria.SiteDbGroupId = server.Id;
            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            var (validationSiteDb, recoverTicketsSiteDb) = await repository.FetchMultipleAsync<RecoverTicketValidation, RecoverTicketModel>(criteria);
            validations.AddRange(validationSiteDb);
            recoverTickets.AddRange(recoverTicketsSiteDb);
        }

        return BuildResultRecoverTickets(recoverTickets, validations);
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

    private static GetTicketsModel BuildResultGetTickets(List<GetTicketModel> tickets, IEnumerable<GetTicketValidation> validations)
    {
        return new GetTicketsModel
        {
            Tickets = tickets,
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