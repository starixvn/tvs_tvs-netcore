using MediatR;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;

namespace SpecialDelete.NumberGame.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<IEnumerable<Result>>;

public class VoidTicketsHandler(VoidService voidService, LoggingService loggingService)
    : IRequestHandler<VoidTicketsRequest, IEnumerable<Result>>
{
    public async Task<IEnumerable<Result>> Handle(VoidTicketsRequest request, CancellationToken cancellationToken)
    {
        var model = await voidService.VoidTickets(request);
        return model.Validation.IsSuccessful ?
            await ContactUsers(request, model.Tickets) :
            [
                new Result { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg }
            ];
    }

    private async Task<List<Result>> ContactUsers(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        var result = new List<Result>();
        try
        {
            if (query.IsSendMessage)
            {
                await voidService.SendMessage(query, tickets);
            }

            result.AddRange(await voidService.SendEmail(query, tickets));
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(query.MatchId.ToString(), exception);
            result.Clear();
            result.Add(new Result
            {
                ErrorCode = ErrorCode.SendMessageOrEmailFail,
                ErrorMsg = exception.Message
            });
        }

        return result;
    }
}