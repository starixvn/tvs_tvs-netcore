using Fanex.Data.Repository;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.RecoverBet.Repositories;

public interface Repository
{
    Task<GetTicketsModel> GetTickets(Query query);

    Task<RecoverTicketsModel> RecoverTicketsNotVirtualSports2Racing(Query query, IEnumerable<BetIdRecover> tickets);

    Task<IEnumerable<TicketsBetTransModel>> GetTicketVs2RacingService(IEnumerable<BetIdRecover> vs2RacingTickets);
}

public class RepositoryImp(IDynamicRepository repository, SessionService sessionService)
    : Repository
{
    public async Task<GetTicketsModel> GetTickets(Query query)
    {
        var criteria = CreateGetTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<GetTicketsValidation, GetTicketModel>(criteria);
        });
        (IEnumerable<GetTicketsValidation> Validation, IEnumerable<GetTicketModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildResultGetTickets(ticketsInAllServers, validationInAllServers);
    }

    public async Task<RecoverTicketsModel> RecoverTicketsNotVirtualSports2Racing(Query query, IEnumerable<BetIdRecover> tickets)
    {
        var criteria = CreateRecoverTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                return Task.FromResult((Enumerable.Empty<RecoverTicketsValidation>(), Enumerable.Empty<RecoverTicketModel>()));
            }

            criteria.TransIds = string.Join(",", ticketsInSiteDb.Select(x => x.TransId));
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<RecoverTicketsValidation, RecoverTicketModel>(criteria);
        });
        (IEnumerable<RecoverTicketsValidation> Validation, IEnumerable<RecoverTicketModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildResultRecoverTickets(validationInAllServers, ticketsInAllServers);
    }
    
    private static GetTicketsCriteria CreateGetTicketsCriteria(Query query)
    {
        return new GetTicketsCriteria
        {
            MatchId = query.MatchId,
            Type = query.Type,
            TicketType = query.TicketType,
            TransIds = query.TransIds
        };
    }

    public async Task<IEnumerable<TicketsBetTransModel>> GetTicketVs2RacingService(IEnumerable<BetIdRecover> vs2RacingTickets)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInSiteDb = vs2RacingTickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                return Task.FromResult(Enumerable.Empty<TicketsBetTransModel>());
            }

            var criteria = new GetTicketsVs2RacingCriteria
            {
                TransIds = string.Join(",", ticketsInSiteDb.Select(x => x.TransId)),
                SiteDbGroupId = server.Id
            };

            return repository.FetchAsync<TicketsBetTransModel>(criteria);
        });

        return (await Task.WhenAll(tasks)).SelectMany(x => x);
    }

    private RecoverTicketsCriteria CreateRecoverTicketsCriteria(Query query)
    {
        return new RecoverTicketsCriteria
        {
            TicketType = query.TicketType,
            Type = query.Type,
            MatchId = query.MatchId,
            Ip = sessionService.GetClientIp(),
            UserId = sessionService.UserId
        };
    }

    private static GetTicketsModel BuildResultGetTickets(IEnumerable<GetTicketModel> tickets, IEnumerable<GetTicketsValidation> validations)
    {
        var validation = new GetTicketsValidation
        {
            InvalidTransIds = Helper.GetIntersectTransIdString(validations.Select(y => y.InvalidTransIds)),
            MovedTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.MovedTransIds))
        };

        return new GetTicketsModel
        {
            Tickets = tickets,
            Validation = validation
        };
    }

    private static RecoverTicketsModel BuildResultRecoverTickets(IEnumerable<RecoverTicketsValidation> validations, IEnumerable<RecoverTicketModel> tickets)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var validation = new RecoverTicketsValidation
        {
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty,
            CompletedMatchIds = Helper.GetUnionTransIdString(validations.Select(x => x.CompletedMatchIds)),
            ReCalculatedMainTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.ReCalculatedMainTransIds)),
            NegativeBalanceUsers = Helper.GetUnionTransIdString(validations.Select(x => x.NegativeBalanceUsers))
        };

        return new RecoverTicketsModel
        {
            Tickets = tickets,
            Validation = validation
        };
    }
}