using Fanex.Data.Repository;
using Settlement.Business.Core.Models;
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

    Task<(IEnumerable<RecoverTicketsValidation>, IEnumerable<RecoverTicketModel>)[]> RecoverNotRacingSports(Query query, IEnumerable<BetIdRecover> tickets);

    Task<(IEnumerable<Outright>, IEnumerable<Resources>)> GetRacingInfo(int matchId);
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

    public async Task<(IEnumerable<RecoverTicketsValidation>, IEnumerable<RecoverTicketModel>)[]> RecoverNotRacingSports(Query query, IEnumerable<BetIdRecover> tickets)
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
        var results = await Task.WhenAll(tasks);

        return results;
    }

    public async Task<(IEnumerable<Outright>, IEnumerable<Resources>)> GetRacingInfo(int matchId)
    {
        var criteria = new GetRacingResultCriteria { MatchId = matchId };
        var (_, secondResult, thirdResult) = await repository.FetchMultipleAsync<string, Outright, Resources>(criteria);

        return (secondResult, thirdResult);
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
}