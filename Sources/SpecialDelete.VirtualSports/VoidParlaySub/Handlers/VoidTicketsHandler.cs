using MediatR;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<List<Result>>;

public class VoidTicketsHandler(
    VoidTicketsService voidTicketsService,
    LoggingService loggingService)
    : IRequestHandler<VoidTicketsRequest, List<Result>>
{
    public async Task<List<Result>> Handle(VoidTicketsRequest request, CancellationToken cancellationToken)
    {
        var results = new List<Result>();
        var model = await voidTicketsService.ExecuteQuery(request);
        results.AddRange(await HandlerVoidedTickets(request, model));
        results.AddRange(HandlerErrorVoidTickets(model));

        return results;
    }

    private async Task<IEnumerable<Result>> HandlerVoidedTickets(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var results = new List<Result>();
        if (!model.Tickets.Any())
        {
            return [];
        }

        results.AddRange(await ContactUser(query, model));

        return results;
    }

    private static IEnumerable<Result> HandlerErrorVoidTickets(VoidTicketsModel model)
    {
        if (model.Validation.IsSuccessful)
        {
            return [];
        }

        var results = new List<Result>
        {
            new() { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg }
        };

        return results;
    }

    private async Task<IEnumerable<Result>> ContactUser(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var results = new List<Result>();
        try
        {
            await voidTicketsService.SendMessage(query, model.Tickets);
            results.AddRange(await voidTicketsService.SendEmail(query, model));
            results.InsertNegativeBalanceWarning(model.Validation.NegativeBalanceUsers);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            results.Clear();
            results.Add(new Result
            {
                ErrorCode = ErrorCode.SendMessageOrEmailFail,
                ErrorMsg = exception.Message
            });
        }

        return results;
    }
}