using AutoMapper;
using Fanex.Data.Repository;
using SpecialDelete.VoidByBetId.Criteria;
using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByBetId.Repositories;

public interface VoidByBetIdRepository
{
    Task<(IEnumerable<GetTicketModel> Tickets, string InvalidTransIds, string MovedTransIds, int MatchId)> GetTickets(GetTicketsQuery query);

    Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query);
}

public class VoidByBetIdRepositoryImp : VoidByBetIdRepository
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;

    public VoidByBetIdRepositoryImp(IMapper mapper, IDynamicRepository repository, SessionService sessionService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<(IEnumerable<GetTicketModel> Tickets, string InvalidTransIds, string MovedTransIds, int MatchId)> GetTickets(GetTicketsQuery query)
    {
        var tickets = new List<GetTicketModel>();
        var validations = new List<GetTicketValidation>();
        var criteria = mapper.Map<GetTicketsCriteria>(query);
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var (validationSiteDb, ticketsSiteDb) = await repository.FetchMultipleAsync<GetTicketValidation, GetTicketModel>(criteria);
            tickets.AddRange(ticketsSiteDb);
            validations.AddRange(validationSiteDb);
        }

        return BuildResultGetTickets(tickets, validations);
    }

    public async Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query)
    {
        var emailTickets = new List<TicketEmailModel>();
        var validations = new List<VoidTicketValidation>();
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
            var (validationSiteDb, emailTicketsSiteDb) = await repository.FetchMultipleAsync<VoidTicketValidation, TicketEmailModel>(criteria);
            emailTickets.AddRange(emailTicketsSiteDb);
            validations.AddRange(validationSiteDb);
        }

        return BuildResultVoidTickets(validations, emailTickets, query);
    }

    private static VoidTicketsModel BuildResultVoidTickets(IEnumerable<VoidTicketValidation> validations, List<TicketEmailModel> emailTickets, VoidTicketsQuery query)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var combineValidation = new VoidTicketValidation
        {
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty
        };
        var siteDbHasError = validations.Where(x => !x.IsSuccessful).Select(x => x.SiteDbGroupId);
        var ticketsRollbackNetPosition = query.TransIdCrickets?.Where(x => siteDbHasError.Any(siteId => siteId == x.SiteDbGroupId));

        return new VoidTicketsModel
        {
            Tickets = emailTickets,
            Validation = combineValidation,
            TicketsRollbackNetPosition = ticketsRollbackNetPosition
        };
    }

    private static (IEnumerable<GetTicketModel> Tickets, string InvalidTransIds, string MovedTransIds, int MatchId) BuildResultGetTickets(IEnumerable<GetTicketModel> tickets
        , IEnumerable<GetTicketValidation> validations)
    {
        var invalidTransIds = Helper.GetIntersectTransIdString(validations.Select(y => y.InvalidTransIds));
        var movedTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.MovedTransIds));
        var validMatchIdI = GetMatchId(validations);
        return (tickets, invalidTransIds, movedTransIds, validMatchIdI);
    }

    private static int GetMatchId(IEnumerable<GetTicketValidation> validations)
    {
        var matchIds = validations.Where(x => x.MatchId != null).Select(x => x.MatchId).Distinct();
        if (matchIds.Contains(0))
        {
            return 0;
        }
        return (int)(matchIds.Count() == 1 ? matchIds.First() : 0) ;
    }

    private VoidTicketsCriteria CreateVoidTicketsCriteria(VoidTicketsQuery query)
    {
        return new VoidTicketsCriteria
        {
            UserId = sessionService.UserId,
            Username = query.Username,
            Password = query.Password,
            Reason = query.Reason,
            ReasonSC = query.ReasonSC,
            Ip = sessionService.GetClientIp(),
            IsAbnormalBet = query.IsAbnormalBet || !query.IsFilterByBetId,
            FilterUserName = query.FilterUserName,
            Products = query.Products,
            StatusIds = query.StatusIds,
            FromDate = query.FromDate,
            ToDate = query.ToDate
        };
    }
}