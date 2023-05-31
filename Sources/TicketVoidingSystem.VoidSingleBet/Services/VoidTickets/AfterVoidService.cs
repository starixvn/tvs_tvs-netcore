using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;

namespace TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;

public interface AfterVoidService
{
    Task<IEnumerable<Result>> ExecuteWhenVoidSuccess(VoidTicketsQuery query, VoidTicketsModel voidResult, string warningCricket);

    IEnumerable<Result> ExecuteWhenVoidFailed(VoidTicketsModel voidResult);
}

public class AfterVoidServiceImp : AfterVoidService
{
    private readonly IMapper mapper;
    private readonly CashOutApiService cashOutApiService;
    private readonly SendMessageService sendMessageService;
    private readonly SendEmailService sendEmailService;
    private readonly NotificationLetstalkService notificationLetstalkService;
    private readonly LoggingService loggingService;
    private readonly SessionService sessionService;

    public AfterVoidServiceImp(IMapper mapper, CashOutApiService cashOutApiService, SendMessageService sendMessageService,
        SendEmailService sendEmailService, NotificationLetstalkService notificationLetstalkService, LoggingService loggingService, SessionService sessionService)
    {
        this.cashOutApiService = cashOutApiService;
        this.sendMessageService = sendMessageService;
        this.sendEmailService = sendEmailService;
        this.notificationLetstalkService = notificationLetstalkService;
        this.loggingService = loggingService;
        this.sessionService = sessionService;
        this.mapper = mapper;
    }

    public async Task<IEnumerable<Result>> ExecuteWhenVoidSuccess(VoidTicketsQuery query, VoidTicketsModel voidResult, string warningCricket)
    {
        if (!voidResult.Tickets.Any())
        {
            return Enumerable.Empty<Result>();
        }

        return await ExecuteWhenHaveVoidTickets(query, voidResult, warningCricket);
    }

    // Xài yield
    private async Task<IEnumerable<Result>> ExecuteWhenHaveVoidTickets(VoidTicketsQuery query, VoidTicketsModel voidResult, string warningCricket)
    {
        await cashOutApiService.VoidBetForCashOutBasketball(voidResult.Tickets);

        var results = new List<Result>();
        try
        {
            results.AddRange(CreateWarningMessage(warningCricket));
            await SendMessage(query, voidResult);
            results.AddRange(await SendEmail(query, voidResult));
            results.AddRange(await SendLetstalk(query, voidResult));
            results.InsertNegativeBalanceWarning(voidResult.Validation.NegativeBalanceUsers);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync($"{query.MatchId}: {exception.Message}", exception);
            results.Clear();
            results.Add(new Result { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message });
        }

        return results;
    }

    private static IEnumerable<Result> CreateWarningMessage(string warningCricket)
    {
        var results = new List<Result>();

        if (string.IsNullOrEmpty(warningCricket))
        {
            return results;
        }
        var executeFailResult = new Result
        {
            ErrorCode = ErrorCode.ExecuteQueryAPIFail,
            ErrorMsg = warningCricket
        };
        results.Add(executeFailResult);

        return results;
    }

    private async Task SendMessage(VoidTicketsQuery query, VoidTicketsModel model)
    {
        query.Message.CreatorId = sessionService.UserId;
        query.Message.CreatorName = sessionService.UserName;
        var messageId = await sendMessageService.InsertMessage(query.Message, query.MatchId, query.Match.LeagueGroupId, false);
        var reasonId = await sendMessageService.InsertReason(query.Reason, query.ReasonSc);
        await sendMessageService.SendMessage(model.Tickets, messageId, 0, query.Message.CreatorId);
        await sendMessageService.InsertMessageIntoAdminSite(query.Message);
        await sendMessageService.InsertVoidedTransaction(model.Tickets, messageId, reasonId, 0, 0, query.MatchId);
    }

    private async Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var emailModel = mapper.Map<EmailVoidModel>(query);
        emailModel.NegativeBalanceUsers = model.Validation.NegativeBalanceUsers;
        return await sendEmailService.SendEmail(emailModel, model.Tickets);
    }

    private async Task<IEnumerable<Result>> SendLetstalk(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var ticketInfoForLetstalk = mapper.Map<TicketInfoForLetstalk>(query);
        return await notificationLetstalkService.SendToGroupVoidSettledBets(ticketInfoForLetstalk, model.Tickets);
    }

    public IEnumerable<Result> ExecuteWhenVoidFailed(VoidTicketsModel voidResult)
    {
        if (voidResult.Validation.ErrorCode == 0)
        {
            return Enumerable.Empty<Result>();
        }

        return new List<Result> { new() { ErrorCode = voidResult.Validation.ErrorCode, ErrorMsg = voidResult.Validation.ErrorMsg } };
    }
}