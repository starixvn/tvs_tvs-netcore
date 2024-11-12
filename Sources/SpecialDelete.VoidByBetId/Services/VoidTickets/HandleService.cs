using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VoidByBetId.Services.VoidTickets;

public interface HandleService
{
    Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query);

    IEnumerable<Result> CreateWarningMessage(string warningCrickets);
}

public class HandleServiceImp(
    VoidByBetIdRepository repository,
    LoggingService loggingService)
    : HandleService
{
    public async Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query)
    {
        VoidTicketsModel model;
        try
        {
            model = await repository.VoidTickets(query);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            var validation = new VoidTicketValidation
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };

            return new VoidTicketsModel
            {
                Validation = validation,
                Tickets = []
            };
        }

        return model;
    }

    public IEnumerable<Result> CreateWarningMessage(string warningCrickets)
    {
        var results = new List<Result>();
        if (!string.IsNullOrEmpty(warningCrickets))
        {
            results.Add(new Result { ErrorCode = ErrorCode.ExecuteQueryAPIFail, ErrorMsg = warningCrickets });
        }

        return results;
    }
}