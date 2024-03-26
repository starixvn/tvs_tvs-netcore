using AutoMapper;
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

    Task<RecoverTicketsModel> RecoverTickets(Query query);
}

public class RepositoryImp : Repository
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;

    public RepositoryImp(IMapper mapper, IDynamicRepository repository, SessionService sessionService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<GetTicketsModel> GetTickets(Query query)
    {
        var criteria = mapper.Map<GetTicketsCriteria>(query);
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

    public async Task<RecoverTicketsModel> RecoverTickets(Query query)
    {
        var criteria = CreateRecoverTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInSiteDb = query.Tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                return Task.FromResult((Enumerable.Empty<RecoverTicketsValidation>(), Enumerable.Empty<RecoverTicketModel>()));
            }

            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<RecoverTicketsValidation, RecoverTicketModel>(criteria);
        });
        (IEnumerable<RecoverTicketsValidation> Validation, IEnumerable<RecoverTicketModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildResultRecoverTickets(validationInAllServers, ticketsInAllServers);
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