using AutoMapper;
using Fanex.Data.Repository;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Criteria;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Repositories;

public interface Repository
{
    Task<GetTicketsModel> GetTickets(GetTicketsQuery query);

    Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query);
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

    public async Task<GetTicketsModel> GetTickets(GetTicketsQuery query)
    {
        var criteria = CreateGetTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<string, GetTicketModel>(criteria);
        });
        (IEnumerable<string> InvalidTransIds, IEnumerable<GetTicketModel> Tickets)[] results = await Task.WhenAll(tasks);
        var invalidTransIdsInAllServers = results.SelectMany(x => x.InvalidTransIds);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return new GetTicketsModel
        {
            Tickets = ticketsInAllServers.ToList(),
            InvalidTransIds = Helper.GetIntersectTransIdString(invalidTransIdsInAllServers)
        };
    }

    public async Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query)
    {
        var criteria = CreateVoidTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInSiteDb = query.Tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                return Task.FromResult((Enumerable.Empty<VoidTicketsValidation>(), Enumerable.Empty<TicketEmailModel>()));
            }

            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<VoidTicketsValidation, TicketEmailModel>(criteria);
        });
        (IEnumerable<VoidTicketsValidation> Validation, IEnumerable<TicketEmailModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildResultVoidTickets(validationInAllServers, ticketsInAllServers);
    }

    private static VoidTicketsModel BuildResultVoidTickets(IEnumerable<VoidTicketsValidation> validations, IEnumerable<TicketEmailModel> emailTickets)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var validation = new VoidTicketsValidation
        {
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty,
            NegativeBalanceUsers = Helper.GetUnionTransIdString(validations.Select(x => x.NegativeBalanceUsers))
        };

        return new VoidTicketsModel
        {
            Tickets = emailTickets,
            Validation = validation
        };
    }

    private static GetTicketsCriteria CreateGetTicketsCriteria(GetTicketsQuery query)
    {
        return new GetTicketsCriteria
        {
            MatchId = query.MatchId,
            BetTypes = query.BetTypes,
            SubTransIds = query.SubTransIds
        };
    }

    private VoidTicketsCriteria CreateVoidTicketsCriteria(VoidTicketsQuery query)
    {
        var criteria = mapper.Map<VoidTicketsCriteria>(query);
        criteria.UserId = sessionService.UserId;
        criteria.Ip = sessionService.GetClientIp();

        return criteria;
    }
}