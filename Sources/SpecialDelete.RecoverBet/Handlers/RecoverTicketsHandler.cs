using MediatR;
using SpecialDelete.RecoverBet.Models;
using SpecialDelete.RecoverBet.Services.RecoverTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.NetPosition;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverBet.Handlers;

public class RecoverTicketsRequest : IRequest<RecoverResult>
{
    public string UsersNegativeCredit { get; set; }

    public IEnumerable<BetId> TransIdCrickets { get; set; }

    public IEnumerable<BetId> Tickets { get; set; }
}

public class RecoverTicketsHandler(
    IRecoverTicketsService recoverTicketsService,
    NetPositionService netPositionService,
    LoggingService loggingService,
    CashOutApiService cashOutApiService)
    : IRequestHandler<RecoverTicketsRequest, RecoverResult>
{
    public async Task<RecoverResult> Handle(RecoverTicketsRequest request, CancellationToken cancellationToken)
    {
        var model = await recoverTicketsService.RecoverTickets(request.Tickets, request.TransIdCrickets);
        var recoverResult = await HandlerRecoveredTickets(model, request.UsersNegativeCredit);
        recoverResult.Results.AddRange(GetResultsRecoverTicketsFail(model));

        return recoverResult;
    }

    private static IEnumerable<Result> GetResultsRecoverTicketsFail(RecoverTicketsModel model)
    {
        var results = new List<Result>();
        if (!model.Validation.IsSuccessful)
        {
            results.Add(new Result { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg });
        }

        return results;
    }

    private async Task<RecoverResult> HandlerRecoveredTickets(RecoverTicketsModel model, string usersNegativeCredit)
    {
        if (!model.Tickets.Any())
        {
            return new RecoverResult();
        }

        var result = new RecoverResult();
        await CallUndoCashOutApi(model.Tickets);
        try
        {
            result = await ContactUser(model, usersNegativeCredit);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception.Message, exception);
            result.Results.Add(new Result { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message });
        }
        finally
        {
            result.Results.Add(await UpdateNetPosition(model.TicketsForUpdateNetPosition));
        }

        return result;
    }

    private async Task<RecoverResult> ContactUser(RecoverTicketsModel model, string usersNegativeCredit)
    {
        var result = new RecoverResult { IsSettledBet = model.Tickets.Any(t => t.IsSettled) };
        var isRequiredResettleMatch = model.Tickets.Any(x => !x.IsCashOut) && model.Tickets.Any(x => x.IsSettled);
        await recoverTicketsService.RemoveMessage(model);
        await recoverTicketsService.SendEmail(model.Tickets.ToList(), usersNegativeCredit);
        result.Results.AddRange(recoverTicketsService.CreateResultMessage(model.Validation.AutoReSettledTransIds, isRequiredResettleMatch));

        return result;
    }

    private async Task CallUndoCashOutApi(IEnumerable<RecoverTicketModel> tickets)
    {
        try
        {
            var jackTimeCashOutTickets = tickets.Where(x => x.IsCashOut && JackTimeCashOutExtension.IsHasJackTimeCashOut(x.SportType, x.ExtraInfo));
            if (jackTimeCashOutTickets.Any())
            {
                var requestModel = new CashOutApiModel { VoidBetInfos = jackTimeCashOutTickets.Select(x => new VoidBetInfo { TransId = x.TransId.ToString(), CustId = x.CustId.ToString() }) };
                await cashOutApiService.UndoVoidBet(requestModel);
            }
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync("SpecialDelete.RecoverBet.Handlers.CallUndoCashOutApi", exception);
        }
    }

    private async Task<Result> UpdateNetPosition(IEnumerable<BetId> transIds)
    {
        var isSuccess = await netPositionService.UpdateNetPosition(transIds, NetPositionConstant.ActionRecover);
        if (isSuccess)
        {
            return new Result();
        }

        return new Result
        {
            ErrorCode = ErrorCode.ExecuteQueryAPIFail,
            ErrorMsg = Helper.MessageFailApiCricket(transIds, NetPositionConstant.ActionRecover)
        };
    }
}