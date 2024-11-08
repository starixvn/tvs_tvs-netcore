using SpecialDelete.RecoverParlayBet.Criteria;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendMessage;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverParlayBet.Services.RecoverTickets;

public interface SeparabilityService<T, in TU>
{
    Task<(RecoverValidationModel Validation, IEnumerable<T> Tickets)> RecoverTickets(TU query);

    Result WarningMessage(string settledMainTrainIds);
}

public class RecoverSubTicketsServiceImp : SeparabilityService<RecoverSubTicketModel, RecoverSubTicketsQuery>
{
    private readonly SessionService sessionService;
    private readonly Repository repository;
    private readonly SendMessageService sendMessageService;
    private readonly LoggingService loggingService;

    public RecoverSubTicketsServiceImp(
        SessionService sessionService,
        Repository repository,
        SendMessageService sendMessageService,
        LoggingService loggingService)
    {
        this.sessionService = sessionService;
        this.repository = repository;
        this.sendMessageService = sendMessageService;
        this.loggingService = loggingService;
    }

    public async Task<(RecoverValidationModel Validation, IEnumerable<RecoverSubTicketModel> Tickets)> RecoverTickets(RecoverSubTicketsQuery query)
    {
        try
        {
            var criteria = new RecoverSubTicketsCriteria
            {
                UserId = sessionService.UserId,
                MatchId = query.MatchId,
                Ip = sessionService.GetClientIp()
            };
            var tasks = SiteDbGroupConstant.ServerList.Select(server =>
            {
                criteria.SiteDbGroupId = server.Id;
                criteria.MainTransIds = string.Join(",", query.Tickets.Where(x => x.SiteDbGroupId == server.Id).Select(x => x.TransId));
                return repository.RecoverTickets<RecoverSubTicketModel>(criteria);
            });

            var results = await Task.WhenAll(tasks);
            var validationInAllServers = results.SelectMany(x => x.Validation);
            var ticketsInAllServers = results.SelectMany(x => x.Tickets);

            RemoveMessage(ticketsInAllServers);

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

    private void RemoveMessage(IEnumerable<RecoverSubTicketModel> tickets)
    {
        var transIds = string.Join(",", tickets.Select(x => x.TransId));
        var userId = sessionService.UserId;
        sendMessageService.RemoveMessage(userId, transIds);
        sendMessageService.DeleteTransaction(tickets.Select(x => new BetId { TransId = x.TransId.ToString(), MatchId = x.MatchId }));
    }
}

public class RecoverMainTicketsServiceImp : SeparabilityService<RecoverMainTicketModel, RecoverMainTicketsQuery>
{
    private readonly SessionService sessionService;
    private readonly Repository repository;
    private readonly SendMessageService sendMessageService;
    private readonly LoggingService loggingService;

    public RecoverMainTicketsServiceImp(
        SessionService sessionService,
        Repository repository,
        SendMessageService sendMessageService,
        LoggingService loggingService)
    {
        this.sessionService = sessionService;
        this.repository = repository;
        this.sendMessageService = sendMessageService;
        this.loggingService = loggingService;
    }

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