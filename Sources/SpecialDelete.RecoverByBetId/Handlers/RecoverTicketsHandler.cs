using MediatR;
using SpecialDelete.RecoverByBetId.Models;
using SpecialDelete.RecoverByBetId.Services.RecoverTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace SpecialDelete.RecoverByBetId.Handlers;

public class RecoverTicketsRequest : RecoverTicketsQuery, IRequest<IEnumerable<Result>>
{
}

public class RecoverTicketsHandler : IRequestHandler<RecoverTicketsRequest, IEnumerable<Result>>
{
    private readonly RecoverTicketsService recoverTicketsService;
    private readonly LoggingService loggingService;

    public RecoverTicketsHandler(
        RecoverTicketsService recoverTicketsService,
        LoggingService loggingService)
    {
        this.recoverTicketsService = recoverTicketsService;
        this.loggingService = loggingService;
    }

    public async Task<IEnumerable<Result>> Handle(RecoverTicketsRequest request, CancellationToken cancellationToken)
    {
        var results = new List<Result>();
        var model = await recoverTicketsService.RecoverTickets(request);
        results.AddRange(await GetResultsRecoverTicketsSuccess(model, request));
        results.AddRange(GetResultsRecoverTicketsFail(model));

        return results;
    }

    private async Task<IEnumerable<Result>> GetResultsRecoverTicketsSuccess(RecoverTicketsModel model, RecoverTicketsQuery message)
    {
        return model.Tickets.Any() ? await ContactUser(model, message) : Enumerable.Empty<Result>();
    }

    private static IEnumerable<Result> GetResultsRecoverTicketsFail(RecoverTicketsModel model)
    {
        var results = new List<Result>();
        if (model.Validation.IsSuccessful)
        {
            return Enumerable.Empty<Result>();
        }
        results.Add(new Result { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg });

        return results;
    }

    private async Task<IEnumerable<Result>> ContactUser(RecoverTicketsModel model, RecoverTicketsQuery query)
    {
        try
        {
            await recoverTicketsService.RemoveMessage(string.Join(",", model.Tickets.Select(x => x.TransId)));
            recoverTicketsService.SendEmail(model.Tickets.ToList(), query.NegativeBalanceUsers);
            return recoverTicketsService.CreateMessage(model);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            return new List<Result>
            {
                new() { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message }
            };
        }
    }
}