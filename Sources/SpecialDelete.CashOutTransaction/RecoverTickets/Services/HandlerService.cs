using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using SpecialDelete.CashOutTransaction.RecoverTickets.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Services;

public interface HandlerService
{
    Task<TicketsViewModel<TicketViewModel>> GetTickets(GetTicketsQuery query);

    Task<List<Result>> RecoverTickets(RecoverTicketsQuery query);
}

public class HandlerServiceImp(
    DisplayUiService getTicketsService,
    RecoverService recoverTicketsService,
    LoggingService loggingService,
    PagingService pagingService,
    CashOutApiService cashOutApiService)
    : HandlerService
{
    public async Task<TicketsViewModel<TicketViewModel>> GetTickets(GetTicketsQuery query)
    {
        var viewModel = new TicketsViewModel<TicketViewModel>();
        var model = await getTicketsService.ExecuteQuery(query);
        var tickets = pagingService.Paging(model.Tickets, query.PageIndex, query.PageSize);
        var groups = pagingService.Groups(tickets, ticket => ticket.GroupName);
        foreach (var item in groups.Where(item => item.Tickets.Any()))
        {
            viewModel.Groups.Add(await getTicketsService.Assign(item));
        }

        viewModel.InvalidTransIds = model.InvalidTransIds;
        viewModel.MovedTransIds = model.MovedTransIds;
        viewModel.IsDiffMatchId = model.IsDiffMatchId;
        viewModel.TotalItem = model.Tickets.Count;

        return viewModel;
    }

    public async Task<List<Result>> RecoverTickets(RecoverTicketsQuery query)
    {
        var results = new List<Result>();
        var model = await recoverTicketsService.ExecuteQuery(query);
        results.AddRange(HandlerInvalidTickets(model.Validation.InvalidTransIds));
        results.AddRange(await HandlerRecoveredTickets(model, query));
        results.AddRange(HandlerErrorRecoverTickets(model));

        return results;
    }

    private async Task<IEnumerable<Result>> HandlerRecoveredTickets(SubmittedTicketsModel<RecoverTicketModel> model, RecoverTicketsQuery query)
    {
        var results = new List<Result>();
        if (!model.Tickets.Any())
        {
            return results;
        }

        await CallUndoCashOutApi(model.Tickets);
        results.Add(await ContactUser(model.Tickets, query));

        return results;
    }

    private static IEnumerable<Result> HandlerErrorRecoverTickets(SubmittedTicketsModel<RecoverTicketModel> model)
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
                ErrorMsg = string.Format(StringResource.FailRecoverCashOutTransaction, invalidTransIds.Replace(",", ", ")),
                ErrorCode = ErrorCode.Default
            }
        };

        return results;
    }

    private async Task<Result> ContactUser(IEnumerable<RecoverTicketModel> tickets, RecoverTicketsQuery query)
    {
        Result result;
        try
        {
            result = await recoverTicketsService.SendEmail(tickets, query.NegativeBalanceUsers);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            result = new Result { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message };
        }

        return result;
    }

    private async Task CallUndoCashOutApi(IEnumerable<RecoverTicketModel> tickets)
    {
        try
        {
            var basketballTickets = tickets.Where(x => x.SportTypeId == SportTypeConstant.Basketball);
            if (basketballTickets.Any())
            {
                var requestModel = new CashOutApiModel { VoidBetInfos = basketballTickets.Select(x => new VoidBetInfo { TransId = x.TransId.ToString(), CustId = x.CustId.ToString() }) };
                await cashOutApiService.UndoVoidBet(requestModel);
            }
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync("SpecialDelete.CashOutTransaction.RecoverTickets.Services.CallUndoCashOutApi", exception);
        }
    }
}