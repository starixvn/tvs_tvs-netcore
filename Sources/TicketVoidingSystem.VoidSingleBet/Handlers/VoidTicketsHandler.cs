using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.VoidSingleBet.Criteria;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<IEnumerable<Result>>
{
}

public class VoidTicketsHandler : IRequestHandler<VoidTicketsRequest, IEnumerable<Result>>
{
    private readonly VoidTicketsService voidTicketsService;
    private readonly ILoggingService loggingService;
    private readonly NetPositionService netPositionService;
    private readonly HelperService helperService;
    private readonly NotificationLetstalkService notificationLetstalkService;
    private readonly VoidResultCacheService voidResultCacheService;
    private readonly CashOutApi cashOutApi;

    public VoidTicketsHandler(
        VoidTicketsService voidTicketsService,
        ILoggingService loggingService,
        NetPositionService netPositionService,
        HelperService helperService,
        NotificationLetstalkService notificationLetstalkService,
        VoidResultCacheService voidResultCacheService,
        CashOutApi cashOutApi)
    {
        this.voidTicketsService = voidTicketsService;
        this.loggingService = loggingService;
        this.netPositionService = netPositionService;
        this.helperService = helperService;
        this.notificationLetstalkService = notificationLetstalkService;
        this.voidResultCacheService = voidResultCacheService;
        this.cashOutApi = cashOutApi;
    }

    public async Task<IEnumerable<Result>> Handle(VoidTicketsRequest request, CancellationToken cancellationToken)
    {
        if (await voidResultCacheService.IsExistVoidResult(request.Guid))
        {
            return null;
        }

        var results = new List<Result>();
        await voidResultCacheService.SetVoidResultCache(message.Guid, results);
        var warningCricket = string.Empty;
        var isSuccessfullyUpdateNetPosition = netPositionService.UpdateNetPosition(message.TransIdCrickets, ActionApiType.Void);
        if (!isSuccessfullyUpdateNetPosition)
        {
            warningCricket = helperService.MessageFailApiCricket(message.TransIdCrickets, ActionApiType.Void);
            message.Tickets = message.Tickets.Where(x => !message.TransIdCrickets.Split(',').Contains(x.TransId));
        }

        if (!message.Tickets.Any())
        {
            results.Add(new Result { ErrorCode = ErrorCode.ExecuteQueryAPIFail, ErrorMsg = warningCricket });
        }
        else
        {
            results = await ResultsVoidTicket(message, warningCricket);
        }

        await voidResultCacheService.SetVoidResultCache(message.Guid, results);

        return results;
    }

    private async Task<List<Result>> ResultsVoidTicket(VoidTicketsQuery query, string warningCrickets)
    {
        var results = new List<Result>();
        var model = await voidTicketsService.ExecuteQuery(query);
        results.AddRange(await CheckVoidTicketsSuccess(query, model, warningCrickets));
        results.AddRange(CheckVoidTicketsFail(query, model));

        return results;
    }

    private async Task<IEnumerable<Result>> CheckVoidTicketsSuccess(VoidTicketsQuery query, VoidTicketsModel model, string warningCricket)
    {
        var results = new List<Result>();
        if (!model.Tickets.Any())
        {
            return Enumerable.Empty<Result>();
        }

        await cashOutApi.VoidBetForCashOutBasketball(model.Tickets);
        try
        {
            results.AddRange(voidTicketsService.CreateWarningMessage(warningCricket));
            results.AddRange(await ContactUser(query, model));
            results.AddRange(SendLetstalk(query, model));
            results.InsertNegativeBalance(model.Validation.NegativeBalanceUsers);
        }
        catch (Exception exception)
        {
            loggingService.WriteWithMatchId(query.MatchId.ToString(), exception);
            results.Clear();
            results.Add(new Result { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message });
        }

        return results;
    }

    private IEnumerable<Result> CheckVoidTicketsFail(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var results = new List<Result>();
        if (model.Validation.ErrorCode == 0)
        {
            return Enumerable.Empty<Result>();
        }

        results.Add(new Result { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg });
        if (model.IsNeedToRollBackNetPosition)
        {
            netPositionService.RollBackNetPosition(query.TransIdCrickets, ActionApiType.Void, model.Validation.ErrorMsg);
        }

        return results;
    }

    private async Task<IEnumerable<Result>> ContactUser(VoidTicketsQuery query, VoidTicketsModel model)
    {
        await voidTicketsService.InsertMessage(query, model);
        var result = voidTicketsService.SendEmail(query, model);

        return result;
    }

    private IEnumerable<Result> SendLetstalk(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var notificationLetstalkModel = Mapper.Map<NotificationLetstalkModel>(query);
        return notificationLetstalkService.Send(notificationLetstalkModel, model.Tickets);
    }
}