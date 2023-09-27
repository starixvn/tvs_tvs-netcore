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
        var ticketsInAllSiteDb = new List<GetTicketModel>();
        var invalidTransIdsInAllSiteDb = new List<string>();
        var criteria = CreateGetTicketsCriteria(query);
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var (invalidTransIdsSiteDb, ticketsInSiteDb) = await repository.FetchMultipleAsync<string, GetTicketModel>(criteria);
            ticketsInAllSiteDb.AddRange(ticketsInSiteDb);
            invalidTransIdsInAllSiteDb.AddRange(invalidTransIdsSiteDb);
        }

        return new GetTicketsModel
        {
            Tickets = ticketsInAllSiteDb,
            InvalidTransIds = Helper.GetIntersectTransIdString(invalidTransIdsInAllSiteDb)
        };
    }

    public async Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query)
    {
        var emailTicketsInAllSiteDb = new List<TicketEmailModel>();
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
            var (validationSiteDb, emailTicketsSiteDb) = await repository.FetchMultipleAsync<VoidTicketsValidation, TicketEmailModel>(criteria);
            emailTicketsInAllSiteDb.AddRange(emailTicketsSiteDb);
            validations.AddRange(validationSiteDb);
        }

        return BuildResultVoidTickets(validations, emailTicketsInAllSiteDb);
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