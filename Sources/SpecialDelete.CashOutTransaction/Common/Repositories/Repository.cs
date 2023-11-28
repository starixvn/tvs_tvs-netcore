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
    GetTicketsModel GetTicketsVoidCashOut(GetTicketsVoidCashOutCriteria criteria);

    GetTicketsModel GetTicketsRecoverCashOut(GetTicketsRecoverCashOutCriteria criteria);

    Task<SubmittedTicketsModel<T>> SubmittedTickets<T, U>(U criteria, IEnumerable<BetId> tickets) where U : ICriteria, ExtendSubmittedTicketCriteria;
}

public class RepositoryImp : Repository
{
    private readonly IDynamicRepository repository;

    public RepositoryImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public GetTicketsModel GetTicketsVoidCashOut(GetTicketsVoidCashOutCriteria criteria)
    {
        var ticketsInAllSiteDb = new List<GetTicketModel>();
        var validationInAllSiteDb = new List<GetTicketValidation>();
        foreach (var serverId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
        {
            criteria.SiteDbGroupId = serverId;
            var (validationInSiteDb, ticketsInSiteDb) = repository.FetchMultiple<GetTicketValidation, GetTicketModel>(criteria);
            ticketsInAllSiteDb.AddRange(ticketsInSiteDb);
            validationInAllSiteDb.AddRange(validationInSiteDb);
        }

        return BuildResultGetTickets(ticketsInAllSiteDb, validationInAllSiteDb);
    }

    public GetTicketsModel GetTicketsRecoverCashOut(GetTicketsRecoverCashOutCriteria criteria)
    {
        var ticketsInAllSiteDb = new List<GetTicketModel>();
        var validationInAllSiteDb = new List<GetTicketValidation>();
        foreach (var serverId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
        {
            criteria.SiteDbGroupId = serverId;
            var (validationInSiteDb, ticketsInSiteDb) = repository.FetchMultiple<GetTicketValidation, GetTicketModel>(criteria);
            ticketsInAllSiteDb.AddRange(ticketsInSiteDb);
            validationInAllSiteDb.AddRange(validationInSiteDb);
        }

        return BuildResultGetTickets(ticketsInAllSiteDb, validationInAllSiteDb);
    }

    public async Task<SubmittedTicketsModel<T>> SubmittedTickets<T, U>(U criteria, IEnumerable<BetId> tickets) where U : ICriteria, ExtendSubmittedTicketCriteria
    {
        var ticketsResponseAllSiteDb = new List<T>();
        var validationInAllSiteDb = new List<SubmittedTicketsValidation>();
        foreach (var serverId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
        {
            var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == serverId);
            if (!ticketsInSiteDb.Any())
            {
                continue;
            }

            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            criteria.SiteDbGroupId = serverId;
            var (validationInSiteDb, ticketsResponseSiteDb) = await repository.FetchMultipleAsync<SubmittedTicketsValidation, T>(criteria);
            ticketsResponseAllSiteDb.AddRange(ticketsResponseSiteDb);
            validationInAllSiteDb.AddRange(validationInSiteDb);
        }

        return BuildResultSubmittedTickets(ticketsResponseAllSiteDb, validationInAllSiteDb);
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