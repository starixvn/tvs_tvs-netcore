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

public class RecoverTicketsServiceImp<T, TU>(
    TicketsHandlerService<T, TU> ticketsHandlerService,
    LoggingService loggingService)
    : RecoverTicketsService<T, TU>
    where T : EmailSupport
    where TU : RecoverMainTicketsQuery
{
    public async Task<IEnumerable<Result>> Recover(TU query)
    {
        var results = new List<Result>();
        var (validation, tickets) = await ticketsHandlerService.RecoverTickets(query);
        if (tickets.Any())
        {
            results.Add(await ContactUser(validation, tickets));
            results.Add(ticketsHandlerService.WarningMessage(validation.SettledMainTranIds));
            results.InsertNegativeBalance(validation.NegativeBalanceUsers);
        }

        if (validation.ErrorCode != 0)
        {
            results.Add(new Result { ErrorCode = validation.ErrorCode, ErrorMsg = validation.ErrorMsg });
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