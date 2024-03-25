using AutoMapper;
using Fanex.Data.Repository;
using SpecialDelete.VoidByCurrency.Criteria;
using SpecialDelete.VoidByCurrency.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByCurrency.Repositories;

public interface VoidByCurrencyRepository
{
    Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query);

    Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query);
}

public class VoidByCurrencyRepositoryImp : VoidByCurrencyRepository
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;

    public VoidByCurrencyRepositoryImp(IMapper mapper, IDynamicRepository repository, SessionService sessionService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query)
    {
        var criteria = CreateGetTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchAsync<GetTicketModel>(criteria);
        });
        var results = await Task.WhenAll(tasks);

        return results.SelectMany(x => x);
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
        (IEnumerable<VoidTicketsValidation> validation, IEnumerable<TicketEmailModel> tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.validation);
        var ticketsInAllServers = results.SelectMany(x => x.tickets);

        return BuildResultVoidTickets(ticketsInAllServers, validationInAllServers, query);
    }

    private static GetTicketsCriteria CreateGetTicketsCriteria(GetTicketsQuery query)
    {
        return new GetTicketsCriteria
        {
            CurrencyIds = query.CurrencyIds,
            LicenseeNames = query.LicenseeNames,
            MatchId = query.MatchId,
            TicketType = query.TicketType,
            IsOutright = query.IsOutright
        };
    }

    private VoidTicketsCriteria CreateVoidTicketsCriteria(VoidTicketsQuery query)
    {
        var criteria = mapper.Map<VoidTicketsCriteria>(query);
        criteria.UserId = sessionService.UserId;
        criteria.UserPassword = query.UserPassword;
        criteria.Ip = sessionService.GetClientIp();

        return criteria;
    }

    private static VoidTicketsModel BuildResultVoidTickets(IEnumerable<TicketEmailModel> tickets, IEnumerable<VoidTicketsValidation> validations, VoidTicketsQuery query)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var combineValidation = new VoidTicketsValidation
        {
            NegativeBalanceUsers = Helper.GetUnionTransIdString(validations.Select(x => x.NegativeBalanceUsers)),
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty
        };
        var siteDbHasError = validations.Where(x => !x.IsSuccessful).Select(x => x.SiteDbGroupId);
        var ticketsRollbackNetPosition = query.CricketTransIds?.Where(x => siteDbHasError.Any(siteId => siteId == x.SiteDbGroupId));

        return new VoidTicketsModel
        {
            Tickets = tickets,
            Validation = combineValidation,
            TicketsRollbackNetPosition = ticketsRollbackNetPosition
        };
    }
}