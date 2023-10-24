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
        var ticketsInAllSiteDb = new List<GetTicketModel>();
        var criteria = CreateGetTicketsCriteria(query);
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var ticketsSiteDb = await repository.FetchAsync<GetTicketModel>(criteria);
            ticketsInAllSiteDb.AddRange(ticketsSiteDb);
        }

        return ticketsInAllSiteDb;
    }

    public async Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query)
    {
        var ticketEmailInAllSiteDb = new List<TicketEmailModel>();
        var validations = new List<VoidTicketsValidation>();
        var criteria = CreateVoidTicketsCriteria(query);

        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            var ticketsInSiteDb = query.Tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                continue;
            }

            criteria.SiteDbGroupId = server.Id;
            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            var (validationSiteDb, ticketEmailSiteDb) = await repository.FetchMultipleAsync<VoidTicketsValidation, TicketEmailModel>(criteria);
            ticketEmailInAllSiteDb.AddRange(ticketEmailSiteDb);
            validations.AddRange(validationSiteDb);
        }

        return BuildResultVoidTickets(ticketEmailInAllSiteDb, validations, query);
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