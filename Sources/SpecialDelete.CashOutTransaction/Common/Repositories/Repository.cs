using Fanex.Data.Repository;
using SpecialDelete.CashOutTransaction.CancelCashOut.Criteria;
using SpecialDelete.CashOutTransaction.Common.Criteria;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.RecoverTickets.Criteria;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.CashOutTransaction.Common.Repositories;

public interface Repository
{
    Task<GetTicketsModel> GetTicketsVoidCashOut(GetTicketsVoidCashOutCriteria criteria);

    Task<GetTicketsModel> GetTicketsRecoverCashOut(GetTicketsRecoverCashOutCriteria criteria);

    Task<SubmittedTicketsModel<T>> SubmittedTickets<T, U>(U criteria, IEnumerable<BetId> tickets) where U : ICriteria, ExtendSubmittedTicketCriteria;
}

public class RepositoryImp : Repository
{
    private readonly IDynamicRepository repository;

    public RepositoryImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<GetTicketsModel> GetTicketsVoidCashOut(GetTicketsVoidCashOutCriteria criteria)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<GetTicketValidation, GetTicketModel>(criteria);
        });
        (IEnumerable<GetTicketValidation> validation, IEnumerable<GetTicketModel> tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.validation);
        var ticketsInAllServers = results.SelectMany(x => x.tickets);

        return BuildResultGetTickets(ticketsInAllServers, validationInAllServers);
    }

    public async Task<GetTicketsModel> GetTicketsRecoverCashOut(GetTicketsRecoverCashOutCriteria criteria)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<GetTicketValidation, GetTicketModel>(criteria);
        });
        (IEnumerable<GetTicketValidation> validation, IEnumerable<GetTicketModel> tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.validation);
        var ticketsInAllServers = results.SelectMany(x => x.tickets);

        return BuildResultGetTickets(ticketsInAllServers, validationInAllServers);
    }

    public async Task<SubmittedTicketsModel<T>> SubmittedTickets<T, U>(U criteria, IEnumerable<BetId> tickets) where U : ICriteria, ExtendSubmittedTicketCriteria
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                IEnumerable<T> emptyList = new List<T>();
                return Task.FromResult((Enumerable.Empty<SubmittedTicketsValidation>(), emptyList));
            }

            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<SubmittedTicketsValidation, T>(criteria);
        });

        (IEnumerable<SubmittedTicketsValidation> validation, IEnumerable<T> tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.validation);
        var ticketsInAllServers = results.SelectMany(x => x.tickets);

        return BuildResultSubmittedTickets(ticketsInAllServers, validationInAllServers);
    }

    private static GetTicketsModel BuildResultGetTickets(IEnumerable<GetTicketModel> tickets, IEnumerable<GetTicketValidation> validations)
    {
        return new GetTicketsModel
        {
            Tickets = tickets.ToList(),
            MovedTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.MovedTransIds)),
            InvalidTransIds = Helper.GetIntersectTransIdString(validations.Select(x => x.InvalidTransIds))
        };
    }

    private static SubmittedTicketsModel<T> BuildResultSubmittedTickets<T>(IEnumerable<T> tickets, IEnumerable<SubmittedTicketsValidation> validations)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var validation = new SubmittedTicketsValidation
        {
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty,
            InvalidTransIds = Helper.GetIntersectTransIdString(validations.Select(x => x.InvalidTransIds))
        };

        return new SubmittedTicketsModel<T>
        {
            Tickets = tickets,
            Validation = validation
        };
    }
}