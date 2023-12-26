using SpecialDelete.RecoverParlayBet.Extensions;
using SpecialDelete.RecoverParlayBet.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace SpecialDelete.RecoverParlayBet.Services.RecoverTickets;

// ReSharper disable once UnusedTypeParameter
public interface RecoverTicketsService<T, in TU> where T : EmailSupport where TU : RecoverMainTicketsQuery // NOSONAR
{
    Task<IEnumerable<Result>> Recover(TU query);
}

public class RecoverTicketsServiceImp<T, TU> : RecoverTicketsService<T, TU> where T : EmailSupport where TU : RecoverMainTicketsQuery
{
    private readonly TicketsHandlerService<T, TU> ticketsHandlerService;
    private readonly LoggingService loggingService;

    public RecoverTicketsServiceImp(
        TicketsHandlerService<T, TU> ticketsHandlerService,
        LoggingService loggingService)
    {
        this.ticketsHandlerService = ticketsHandlerService;
        this.loggingService = loggingService;
    }

    public async Task<IEnumerable<Result>> Recover(TU query)
    {
        var results = new List<Result>();
        var model = await ticketsHandlerService.RecoverTickets(query);
        if (model.Tickets?.Count() > 0)
        {
            results.Add(await ContactUser(model.Validation, model.Tickets));
            results.Add(ticketsHandlerService.WarningMessage(model.Validation.SettledMainTranIds));
            results.InsertNegativeBalance(model.Validation.NegativeBalanceUsers);
        }

        if (model.Validation.ErrorCode != 0)
        {
            results.Add(new Result { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg });
        }

        return results;
    }

    private async Task<Result> ContactUser(RecoverValidationModel validation, IEnumerable<T> tickets)
    {
        Result result;
        try
        {
            result = await ticketsHandlerService.SendEmail(tickets, validation.NegativeBalanceUsers);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            result = new Result { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message };
        }

        return result;
    }
}