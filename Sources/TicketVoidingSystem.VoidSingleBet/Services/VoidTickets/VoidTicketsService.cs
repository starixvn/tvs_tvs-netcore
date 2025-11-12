using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeHybridParlay;
using TicketVoidingSystem.Utilities;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;

namespace TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;

public interface VoidTicketsService
{
    Task<VoidTicketsModel> VoidBet(VoidTicketsQuery query);
}

public class VoidTicketsServiceImp(
    SessionService sessionService,
    IMapper mapper,
    IDynamicRepository repository,
    LoggingService loggingService,
    HybridParlayTicketService hybridParlayTicketService)
    : VoidTicketsService
{
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
                Tickets = []
            };
        }
    }

    private async Task<VoidTicketsModel> HandleVoidWhenSuccess(VoidTicketsQuery query)
    {
        var criteria = CreateVoidTicketsCriteria(query);
        var serversWithTickets = query.Tickets.GroupBy(x => x.SiteDbGroupId);
        var tasks = serversWithTickets.Select(async serverGroup =>
        {
            var serverId = serverGroup.Key;
            var ticketsInServer = serverGroup.ToList();
            var hybridParlayTransIds = Helper.GetUnionTransIdString(ticketsInServer.Where(t => t.IsHybrid).Select(x => x.TransId));
            var isCalledJackTimeHybridParlay = await hybridParlayTicketService.Execute(hybridParlayTransIds, HybridParlayType.VoidSub, HybridParlayTicketType.Sub, serverId);

            criteria.IsCalledJackTimeHybridParlay = isCalledJackTimeHybridParlay;
            criteria.SiteDbGroupId = serverId;
            criteria.TransIds = Helper.JoinBetIdList(ticketsInServer);

            return await repository.FetchMultipleAsync<VoidTicketValidation, TicketEmailModel>(criteria);
        });

        var results = await Task.WhenAll(tasks);

        var validationInAllServers = results.SelectMany(x => x.Item1).ToList();
        var ticketsInAllServers = results.SelectMany(x => x.Item2).ToList();

        return BuildResultVoidTickets(ticketsInAllServers, validationInAllServers, query);
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

    private static VoidTicketsModel BuildResultVoidTickets(IEnumerable<TicketEmailModel> tickets, IList<VoidTicketValidation> validations, VoidTicketsQuery query)
    {
        var combineValidation = CreateVoidTicketValidation(validations);
        var siteDbHasError = validations.Where(x => !x.IsSuccessful).Select(x => x.SiteDbGroupId);
        var ticketsRollbackNetPosition = query.TransIdCrickets.Where(x => siteDbHasError.Any(siteId => siteId == x.SiteDbGroupId));
        return new VoidTicketsModel
        {
            Tickets = tickets.ToList(),
            Validation = combineValidation,
            TicketsRollbackNetPosition = ticketsRollbackNetPosition
        };
    }

    private VoidTicketsCriteria CreateVoidTicketsCriteria(VoidTicketsQuery query)
    {
        var criteria = mapper.Map<VoidTicketsCriteria>(query);
        criteria.FromTransDate = query.FromTransDate?.ZoneCanada();
        criteria.ToTransDate = query.ToTransDate?.ZoneCanada();
        criteria.Ip = sessionService.GetClientIp();
        criteria.LiveIndicator = query.EventType;
        criteria.SecondAcceptFlag = query.TicketType;
        criteria.BetTypes = query.BetTypes.ToBetTypeXml();
        criteria.UserPassword = query.UserPassword;
        criteria.UserId = sessionService.UserId;

        return criteria;
    }
}