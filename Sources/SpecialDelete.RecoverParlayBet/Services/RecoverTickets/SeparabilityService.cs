using SpecialDelete.RecoverParlayBet.Criteria;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeHybridParlay;
using TicketVoidingSystem.Services.SendMessage;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverParlayBet.Services.RecoverTickets;

public interface SeparabilityService<T, in TU>
{
    Task<(RecoverValidationModel Validation, IEnumerable<T> Tickets)> RecoverTickets(TU query);

    Result WarningMessage(string settledMainTrainIds);
}

public class RecoverSubTicketsServiceImp(
    SessionService sessionService,
    Repository repository,
    SendMessageService sendMessageService,
    LoggingService loggingService,
    HybridParlayTicketService hybridParlayTicketService)
    : SeparabilityService<RecoverSubTicketModel, RecoverSubTicketsQuery>
{
    public async Task<(RecoverValidationModel Validation, IEnumerable<RecoverSubTicketModel> Tickets)> RecoverTickets(RecoverSubTicketsQuery query)
    {
        try
        {
            var tasks = SiteDbGroupConstant.ServerList.Select(async server =>
            {
                var ticketsInServer = query.Tickets.Where(x => x.SiteDbGroupId == server.Id);
                var isCalledJackTimeHybridParlay = await hybridParlayTicketService
                    .Execute(ticketsInServer.Where(t => t.IsHybrid), HybridParlayType.RecoverSub, HybridParlayTicketType.Sub, server.Id);
                var criteria = CreateRecoverSubTicketsCriteria(query, isCalledJackTimeHybridParlay, server.Id, ticketsInServer);

                return await repository.RecoverTickets<RecoverSubTicketModel>(criteria);
            });

            var results = await Task.WhenAll(tasks);
            var validationInAllServers = results.SelectMany(x => x.Validation);
            var ticketsInAllServers = results.SelectMany(x => x.Tickets);

            await RemoveMessage(ticketsInAllServers);

            var firstErrorResult = validationInAllServers.FirstOrDefault(x => !x.IsSuccessful);
            var combineValidation = new RecoverValidationModel
            {
                ErrorCode = firstErrorResult?.ErrorCode ?? 0,
                ErrorMsg = firstErrorResult?.ErrorMsg ?? string.Empty,
                SettledMainTranIds = Helper.GetUnionTransIdString(validationInAllServers.Select(x => x.SettledMainTranIds)),
                NegativeBalanceUsers = Helper.GetUnionTransIdString(validationInAllServers.Select(x => x.NegativeBalanceUsers))
            };

            return (combineValidation, ticketsInAllServers);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            var validation = new RecoverValidationModel
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };

            return (validation, new List<RecoverSubTicketModel>());
        }
    }

    public Result WarningMessage(string settledMainTrainIds)
    {
        return string.IsNullOrWhiteSpace(settledMainTrainIds) ? new Result { ErrorMsg = StringResource.RecoverTicketReturnRunning } :
            new Result { ErrorMsg = StringResource.RecoverParlaySettledMessage };
    }

    private async Task RemoveMessage(IEnumerable<RecoverSubTicketModel> tickets)
    {
        var transIds = string.Join(",", tickets.Select(x => x.TransId));
        var userId = sessionService.UserId;
        await sendMessageService.RemoveMessage(userId, transIds);
        await sendMessageService.DeleteTransaction(tickets.Select(x => new BetId { TransId = x.TransId.ToString(), MatchId = x.MatchId }));
    }

    private RecoverSubTicketsCriteria CreateRecoverSubTicketsCriteria(RecoverSubTicketsQuery query, bool isCalledJackTimeHybridParlay, int siteDbGroupId,
        IEnumerable<BetId> ticketsInServer)
    {
        var criteria = new RecoverSubTicketsCriteria
        {
            UserId = sessionService.UserId,
            MatchId = query.MatchId,
            Ip = sessionService.GetClientIp(),
            BetType = query.BetType,
            IsCalledJackTimeHybridParlay = isCalledJackTimeHybridParlay,
            SiteDbGroupId = siteDbGroupId,
            MainTransIds = string.Join(",", ticketsInServer.Select(x => x.TransId)),
            SubTransIdsHP = ticketsInServer.Any(x => x.IsHybrid)
                ? string.Join(",", ticketsInServer.Where(x => x.IsHybrid).Select(x => x.SubTransId))
                : null,
        };

        return criteria;
    }
}

public class RecoverMainTicketsServiceImp(
    SessionService sessionService,
    Repository repository,
    SendMessageService sendMessageService,
    LoggingService loggingService,
    HybridParlayTicketService hybridParlayTicketService)
    : SeparabilityService<RecoverMainTicketModel, RecoverMainTicketsQuery>
{
    public async Task<(RecoverValidationModel Validation, IEnumerable<RecoverMainTicketModel> Tickets)> RecoverTickets(RecoverMainTicketsQuery query)
    {
        try
        {
            var criteria = new RecoverMainTicketsCriteria
            {
                UserId = sessionService.UserId,
                Ip = sessionService.GetClientIp()
            };
            var tasks = SiteDbGroupConstant.ServerList.Select(server =>
            {
                hybridParlayTicketService.Execute(query.Tickets.Where(t => t.IsHybrid), HybridParlayType.RecoverMain, HybridParlayTicketType.Main, server.Id);

                criteria.SiteDbGroupId = server.Id;
                criteria.TransIds = string.Join(",", query.Tickets.Where(x => x.SiteDbGroupId == server.Id).Select(x => x.TransId));
                return repository.RecoverTickets<RecoverMainTicketModel>(criteria);
            });

            var results = await Task.WhenAll(tasks);
            var validationInAllServers = results.SelectMany(x => x.Validation);
            var ticketsInAllServers = results.SelectMany(x => x.Tickets);

            RemoveMessage(query);

            var firstErrorResult = validationInAllServers.FirstOrDefault(x => !x.IsSuccessful);
            var combineValidation = new RecoverValidationModel
            {
                ErrorMsg = firstErrorResult?.ErrorMsg ?? string.Empty,
                ErrorCode = firstErrorResult?.ErrorCode ?? 0,
                NegativeBalanceUsers = Helper.GetUnionTransIdString(validationInAllServers.Select(x => x.NegativeBalanceUsers)),
                SettledMainTranIds = Helper.GetUnionTransIdString(validationInAllServers.Select(x => x.SettledMainTranIds))
            };

            return (combineValidation, ticketsInAllServers);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            var validation = new RecoverValidationModel
            {
                ErrorMsg = exception.Message,
                ErrorCode = ErrorCode.ExecuteQueryFail
            };

            return (validation, new List<RecoverMainTicketModel>());
        }
    }

    public Result WarningMessage(string settledMainTrainIds)
    {
        return string.IsNullOrWhiteSpace(settledMainTrainIds) ?
            new Result { ErrorMsg = StringResource.RecoverTicketReturnRunning } :
            new Result { ErrorMsg = string.Format(StringResource.WarningAutoReSettleTransIds, settledMainTrainIds) };
    }

    private void RemoveMessage(RecoverMainTicketsQuery query)
    {
        var transIds = string.Join(",", query.Tickets.Select(x => x.TransId));
        var userId = sessionService.UserId;
        sendMessageService.RemoveMessage(userId, transIds);
        sendMessageService.DeleteTransaction(query.Tickets.Select(x => new BetId { TransId = x.TransId, MatchId = x.MatchId }));
    }
}