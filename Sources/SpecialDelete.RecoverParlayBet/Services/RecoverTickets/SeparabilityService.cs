using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpecialDelete.Common.Services;
using SpecialDelete.Common.UpdateMessage.Services;
using SpecialDelete.Core.Constants;
using SpecialDelete.Core.DTO;
using SpecialDelete.Core.Resources;
using SpecialDelete.Core.Services;
using SpecialDelete.Core.Utils;
using SpecialDelete.RecoverParlayBet.Criteria;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Repositories;

namespace SpecialDelete.RecoverParlayBet.Services.RecoverTickets;

public interface SeparabilityService<T, in TU>
{
    Task<(RecoverValidationModel Validation, IEnumerable<T> Tickets)> RecoverTickets(TU query);

    Result WarningMessage(string settledMainTrainIds);
}

public class RecoverSubTicketsServiceImp : SeparabilityService<RecoverSubTicketModel, RecoverSubTicketsQuery>
{
    private readonly ISessionService sessionService;
    private readonly Repository repository;
    private readonly MessageService messageService;
    private readonly ILoggingService loggingService;

    public RecoverSubTicketsServiceImp(
        ISessionService sessionService,
        Repository repository,
        MessageService messageService,
        ILoggingService loggingService)
    {
        this.sessionService = sessionService;
        this.repository = repository;
        this.messageService = messageService;
        this.loggingService = loggingService;
    }

    public async Task<(RecoverValidationModel Validation, IEnumerable<RecoverSubTicketModel> Tickets)> RecoverTickets(RecoverSubTicketsQuery query)
    {
        try
        {
            var validationInAllServers = new List<RecoverValidationModel>();
            var ticketsInAllServers = new List<RecoverSubTicketModel>();

            var criteria = new RecoverSubTicketsCriteria
            {
                UserId = sessionService.UserId,
                MatchId = query.MatchId,
                Ip = sessionService.GetClientIp()
            };

            foreach (var serverId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
            {
                criteria.SiteDbGroupId = serverId;
                criteria.MainTransIds = string.Join(",", query.Tickets.Where(x => x.SiteDbGroupId == serverId).Select(x => x.TransId));
                var data = await repository.RecoverTickets<RecoverSubTicketModel>(criteria);

                validationInAllServers.AddRange(data.Validation);
                ticketsInAllServers.AddRange(data.Tickets);
            }

            RemoveMessage(ticketsInAllServers);

            var firstErrorResult = validationInAllServers.Find(x => !x.IsSuccessful);
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
            loggingService.Error(exception);
            var validation = new RecoverValidationModel
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };

            return (validation, null);
        }
    }

    public Result WarningMessage(string settledMainTrainIds)
    {
        return string.IsNullOrWhiteSpace(settledMainTrainIds) ? new Result { ErrorMsg = Messages.RecoverTicketReturnRunning } :
            new Result { ErrorMsg = Labels.RecoverParlaySettledMessage };
    }

    private void RemoveMessage(IEnumerable<RecoverSubTicketModel> tickets)
    {
        var transIds = string.Join(",", tickets.Select(x => x.TransId));
        var userId = sessionService.UserId;
        messageService.RemoveMessage(userId, transIds);
        messageService.DeleteTransaction(tickets.Select(x => new BetId { TransId = x.TransId.ToString(), MatchId = x.MatchId }));
    }
}

public class RecoverMainTicketsServiceImp : SeparabilityService<RecoverMainTicketModel, RecoverMainTicketsQuery>
{
    private readonly ISessionService sessionService;
    private readonly Repository repository;
    private readonly MessageService messageService;
    private readonly ILoggingService loggingService;

    public RecoverMainTicketsServiceImp(
        ISessionService sessionService,
        Repository repository,
        MessageService messageService,
        ILoggingService loggingService)
    {
        this.sessionService = sessionService;
        this.repository = repository;
        this.messageService = messageService;
        this.loggingService = loggingService;
    }

    public async Task<(RecoverValidationModel Validation, IEnumerable<RecoverMainTicketModel> Tickets)> RecoverTickets(RecoverMainTicketsQuery query)
    {
        try
        {
            var validationInAllServers = new List<RecoverValidationModel>();
            var ticketsInAllServers = new List<RecoverMainTicketModel>();
            var criteria = new RecoverMainTicketsCriteria
            {
                UserId = sessionService.UserId,
                Ip = sessionService.GetClientIp()
            };

            foreach (var serverId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
            {
                criteria.SiteDbGroupId = serverId;
                criteria.TransIds = string.Join(",", query.Tickets.Where(x => x.SiteDbGroupId == serverId).Select(x => x.TransId));
                var data = await repository.RecoverTickets<RecoverMainTicketModel>(criteria);

                validationInAllServers.AddRange(data.Validation);
                ticketsInAllServers.AddRange(data.Tickets);
            }

            RemoveMessage(query);

            var firstErrorResult = validationInAllServers.Find(x => !x.IsSuccessful);
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
            loggingService.Error(exception);
            var validation = new RecoverValidationModel
            {
                ErrorMsg = exception.Message,
                ErrorCode = ErrorCode.ExecuteQueryFail
            };

            return (validation, null);
        }
    }

    public Result WarningMessage(string settledMainTrainIds)
    {
        return string.IsNullOrWhiteSpace(settledMainTrainIds) ?
            new Result { ErrorMsg = Messages.RecoverTicketReturnRunning } :
            new Result { ErrorMsg = string.Format(Messages.WarningAutoReSettleTransIds, settledMainTrainIds) };
    }

    private void RemoveMessage(RecoverMainTicketsQuery query)
    {
        var transIds = string.Join(",", query.Tickets.Select(x => x.TransId));
        var userId = sessionService.UserId;
        messageService.RemoveMessage(userId, transIds);
        messageService.DeleteTransaction(query.Tickets.Select(x => new BetId { TransId = x.TransId, MatchId = x.MatchId }));
    }
}