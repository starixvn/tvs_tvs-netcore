using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;

namespace TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;

public interface VoidTicketsService
{
    Task<VoidTicketsModel> VoidBet(VoidTicketsQuery query);
}

public class VoidTicketsServiceImp : VoidTicketsService
{
    private readonly IMapper mapper;
    private readonly SessionService sessionService;
    private readonly IDynamicRepository repository;
    private readonly LoggingService loggingService;

    public VoidTicketsServiceImp(SessionService sessionService, IMapper mapper, IDynamicRepository repository, LoggingService loggingService)
    {
        this.sessionService = sessionService;
        this.mapper = mapper;
        this.repository = repository;
        this.loggingService = loggingService;
    }

    public async Task<VoidTicketsModel> VoidBet(VoidTicketsQuery query)
    {
        try
        {
            return await HandleVoidWhenSuccess(query);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync($"{query.MatchId}: {exception.Message}", exception);
            var validation = new VoidTicketValidation
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };

            return new VoidTicketsModel
            {
                Validation = validation,
                Tickets = Enumerable.Empty<TicketEmailModel>()
            };
        }
    }

    private async Task<VoidTicketsModel> HandleVoidWhenSuccess(VoidTicketsQuery query)
    {
        var ticketsInAllServers = new List<TicketEmailModel>();
        var validationsInAllServers = new List<VoidTicketValidation>();
        var criteria = CreateVoidTicketsCriteria(query);

        var serversWithTickets = query.Tickets.GroupBy(x => x.SiteDbGroupId);

        foreach (var serverGroup in serversWithTickets)
        {
            var serverId = serverGroup.Key;
            var ticketsInSiteDb = serverGroup.ToList();

            criteria.SiteDbGroupId = serverId;
            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            var (validation, emailTicketsSiteDb) = await repository.FetchMultipleAsync<VoidTicketValidation, TicketEmailModel>(criteria);
            ticketsInAllServers.AddRange(emailTicketsSiteDb);
            validationsInAllServers.AddRange(validation);
        }

        return BuildResultVoidTickets(ticketsInAllServers, validationsInAllServers);
    }

    private static VoidTicketValidation CreateVoidTicketValidation(IList<VoidTicketValidation> validations)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        return new VoidTicketValidation
        {
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty,
            NegativeBalanceUsers = Helper.GetUnionTransIdString(validations.Select(x => x.NegativeBalanceUsers))
        };
    }

    private static VoidTicketsModel BuildResultVoidTickets(IEnumerable<TicketEmailModel> tickets, IList<VoidTicketValidation> validations)
    {
        var validation = CreateVoidTicketValidation(validations);
        return new VoidTicketsModel
        {
            Tickets = tickets.ToList(),
            Validation = validation,
            IsNeedToRollBackNetPosition = validations.Any(x => !x.IsSuccessful && x.SiteDbGroupId == SiteDbGroupConstant.CentralDb)
        };
    }

    private VoidTicketsCriteria CreateVoidTicketsCriteria(VoidTicketsQuery query)
    {
        var criteria = mapper.Map<VoidTicketsCriteria>(query);
        criteria.FromTransDate = query.FromTransDate.ZoneCanada();
        criteria.ToTransDate = query.ToTransDate.ZoneCanada();
        criteria.Ip = sessionService.GetClientIp();
        criteria.LiveIndicator = query.EventType;
        criteria.SecondAcceptFlag = query.TicketType;
        criteria.BetTypes = query.BetTypes.ToBetTypeXml();
        criteria.UserPassword = query.UserPassword;
        criteria.UserId = sessionService.UserId;

        return criteria;
    }
}