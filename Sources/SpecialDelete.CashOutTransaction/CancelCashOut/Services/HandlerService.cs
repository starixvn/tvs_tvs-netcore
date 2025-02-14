using SpecialDelete.CashOutTransaction.CancelCashOut.Models;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Services;

public interface HandlerService
{
    Task<TicketsViewModel<TicketViewModel>> GetTickets(GetTicketsQuery query);

    Task<List<Result>> VoidTickets(VoidTicketsQuery query);
}

public class HandlerServiceImp(
    DisplayUiService getTicketsService,
    VoidService voidTicketsService,
    LoggingService loggingService,
    CashOutApiService cashOutApiService)
    : HandlerService
{
    public async Task<TicketsViewModel<TicketViewModel>> GetTickets(GetTicketsQuery query)
    {
        var viewModel = new TicketsViewModel<TicketViewModel>();
        var model = await getTicketsService.ExecuteQuery(query);
        var ticketsPaging = getTicketsService.Paging(model.Tickets, query.PageIndex, query.PageSize);
        var groups = getTicketsService.Groups(ticketsPaging);
        foreach (var item in groups.Where(item => item.Tickets.Any()))
        {
            viewModel.Groups.Add(await getTicketsService.Assign(item));
        }

        viewModel.InvalidTransIds = model.InvalidTransIds;
        viewModel.MovedTransIds = model.MovedTransIds;
        viewModel.IsDiffMatchId = model.IsDiffMatchId;
        viewModel.TotalItem = model.Tickets.Count;
        viewModel.IsCashOutAsUnSettledTicket = model.Tickets.TrueForAll(x => x.StatusWinLost == null);

        return viewModel;
    }

    public async Task<List<Result>> VoidTickets(VoidTicketsQuery query)
    {
        var results = new List<Result>();
        var model = await voidTicketsService.ExecuteQuery(query);
        results.AddRange(HandlerInvalidTickets(model.Validation.InvalidTransIds));
        results.AddRange(await HandlerVoidedTickets(model, query));
        results.AddRange(HandlerErrorRecoverTickets(model));

        return results;
    }

    public async Task<IEnumerable<Result>> HandlerVoidedTickets(SubmittedTicketsModel<TicketEmailModel> model, VoidTicketsQuery query)
    {
        var results = new List<Result>();
        if (!model.Tickets.Any())
        {
            return [];
        }

        await CallCashOutApi(model.Tickets);
        results.AddRange(await ContactUser(query, model.Tickets));

        return results;
    }

    public IEnumerable<Result> HandlerErrorRecoverTickets(SubmittedTicketsModel<TicketEmailModel> model)
    {
        var results = new List<Result>();
        if (!model.Validation.IsSuccessful)
        {
            results.Add(new Result { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg });
        }

        return results;
    }

    private static IEnumerable<Result> HandlerInvalidTickets(string invalidTransIds)
    {
        if (string.IsNullOrWhiteSpace(invalidTransIds))
        {
            return [];
        }

        var results = new List<Result>
        {
            new()
            {
                ErrorMsg = string.Format(StringResource.FailVoidTickets, invalidTransIds.Replace(",", ", ")),
                ErrorCode = ErrorCode.Default
            }
        };

        return results;
    }

    private async Task<IEnumerable<Result>> ContactUser(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        var results = new List<Result>();
        try
        {
            await voidTicketsService.SendMessage(query, tickets);
            results.AddRange(await voidTicketsService.SendEmail(query, tickets));
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            results.Clear();
            results.Add(new Result { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message });
        }

        return results;
    }

    private async Task CallCashOutApi(IEnumerable<TicketEmailModel> tickets)
    {
        try
        {
            var jackTimeCashOutTickets = tickets.Where(x => x.SportTypeId.IsHaveJackTimeCashOutTickets());
            if (jackTimeCashOutTickets.Any())
            {
                var requestModel = new CashOutApiModel { VoidBetInfos = jackTimeCashOutTickets.Select(x => new VoidBetInfo { TransId = x.TransId.ToString(), CustId = x.CustId.ToString() }) };
                await cashOutApiService.VoidBet(requestModel);
            }
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync("SpecialDelete.CashOutTransaction.Services.CallCashOutApi", exception);
        }
    }
}