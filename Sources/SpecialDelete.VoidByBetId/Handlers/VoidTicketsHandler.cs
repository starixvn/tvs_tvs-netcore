using MediatR;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.NetPosition;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByBetId.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<List<Result>>;

public class VoidTicketsHandler(
    NetPositionService netPositionService,
    HandleService handleService,
    LoggingService loggingService,
    ResultCacheService resultCacheService,
    CashOutApiService cashOutApiService,
    AfterVoidService afterVoidService)
    : IRequestHandler<VoidTicketsRequest, List<Result>>
{
    public async Task<List<Result>> Handle(VoidTicketsRequest request, CancellationToken cancellationToken)
    {
        if (await resultCacheService.IsExistResult(request.Guid))
        {
            return null;
        }

        var results = new List<Result>();
        await resultCacheService.SetVoidResultsCache(request.Guid, results);

        var warningCrickets = string.Empty;
        var callNetPosition = await netPositionService.UpdateNetPosition(request.TransIdCrickets, NetPositionConstant.ActionVoid);
        if (!callNetPosition)
        {
            warningCrickets = Helper.MessageFailApiCricket(request.TransIdCrickets, NetPositionConstant.ActionVoid);
            request.Tickets = request.Tickets.Where(x => request.TransIdCrickets.All(y => y.TransId != x.TransId));
        }

        if (!request.Tickets.Any())
        {
            results.Add(new Result { ErrorCode = ErrorCode.ExecuteQueryAPIFail, ErrorMsg = warningCrickets });
        }
        else
        {
            results = await ResultsVoidTicket(request, warningCrickets);
        }

        await resultCacheService.SetVoidResultsCache(request.Guid, results);

        return results;
    }

    private async Task<List<Result>> ResultsVoidTicket(VoidTicketsQuery query, string warningCrickets)
    {
        var results = new List<Result>();
        var model = await handleService.VoidTickets(query);
        results.AddRange(await HandlerVoidedTickets(query, model, warningCrickets));
        results.AddRange(await CheckVoidTicketsFail(model));

        return results;
    }

    private async Task<IEnumerable<Result>> HandlerVoidedTickets(VoidTicketsQuery query, VoidTicketsModel model, string warningCrickets)
    {
        var results = new List<Result>();
        if (!model.Tickets.Any())
        {
            return [];
        }

        results.AddRange(await ContactUser(query, model, warningCrickets));
        await cashOutApiService.VoidBetForCashOutBasketball(model.Tickets);

        return results;
    }

    private async Task<IEnumerable<Result>> CheckVoidTicketsFail(VoidTicketsModel model)
    {
        var results = new List<Result>();
        if (model.Validation.IsSuccessful)
        {
            return [];
        }

        results.Add(new Result { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg });
        await netPositionService.RollBackNetPosition(model.TicketsRollbackNetPosition);

        return results;
    }

    private async Task<IEnumerable<Result>> ContactUser(VoidTicketsQuery query, VoidTicketsModel model, string warningCrickets)
    {
        var results = new List<Result>();
        try
        {
            results.AddRange(handleService.CreateWarningMessage(warningCrickets));
            await ContactUser(query, model, results);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            results.Clear();
            results.Add(new Result { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message });
        }

        return results;
    }

    private async Task ContactUser(VoidTicketsQuery query, VoidTicketsModel model, List<Result> results)
    {
        if (model.Tickets.Any())
        {
            await afterVoidService.SendMessage(query, model.Tickets);
            results.AddRange(await afterVoidService.SendEmail(query, model.Tickets.ToList()));
            results.AddRange(await afterVoidService.SendLetstalk(query, model));
        }
    }
}