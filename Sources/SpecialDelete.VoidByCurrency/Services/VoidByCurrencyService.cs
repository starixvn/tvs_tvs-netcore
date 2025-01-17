using AutoMapper;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services.GetTickets;
using SpecialDelete.VoidByCurrency.Services.VoidTickets;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.NetPosition;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByCurrency.Services;

public interface VoidByCurrencyService
{
    Task<TicketsViewModel> GetTickets(GetTicketsQuery query);

    Task<IEnumerable<Result>> VoidBet(VoidTicketsQuery query);
}

public class VoidByCurrencyServiceImp(
    IMapper mapper,
    GetTicketsService getTicketsService,
    LoggingService loggingService,
    VoidTicketsService voidTicketsService,
    NetPositionService netPositionService,
    PagingService pagingService,
    NotificationLetstalkService notificationLetstalkService,
    CashOutApiService cashOutApiService)
    : VoidByCurrencyService
{
    private string MessageCricket { get; set; }

    public async Task<TicketsViewModel> GetTickets(GetTicketsQuery query)
    {
        var viewModel = new TicketsViewModel();
        var tickets = await getTicketsService.GetTickets(query);
        var ticketsPaging = pagingService.Paging(tickets.ToList(), query.PageIndex, query.PageSize);
        var groups = pagingService.Groups(ticketsPaging, ticket => ticket.GroupName);
        foreach (var item in groups)
        {
            viewModel.Groups.Add(await getTicketsService.AssignData(item, query.IsOutright));
        }
        viewModel.TotalItems = tickets.Count();

        UpdateTimeViewModel(viewModel, tickets);

        return viewModel;
    }

    public async Task<IEnumerable<Result>> VoidBet(VoidTicketsQuery query)
    {
        var results = new List<Result>();
        var callNetPosition = await netPositionService.UpdateNetPosition(query.CricketTransIds, NetPositionConstant.ActionVoid);
        if (!callNetPosition)
        {
            MessageCricket = Helper.MessageFailApiCricket(query.CricketTransIds, NetPositionConstant.ActionVoid);
            query.Tickets = query.Tickets.Where(x => query.CricketTransIds.All(y => y.TransId != x.TransId));
        }

        if (!query.Tickets.Any())
        {
            results.Add(new Result { ErrorCode = ErrorCode.ExecuteQueryAPIFail, ErrorMsg = MessageCricket });
        }
        else
        {
            results.AddRange(await VoidTickets(query));
        }

        return results;
    }

    private async Task<IEnumerable<Result>> VoidTickets(VoidTicketsQuery query)
    {
        var results = new List<Result>();
        var model = await voidTicketsService.ExecuteQuery(query);
        results.AddRange(await HandlerVoidedTickets(model, query));
        results.AddRange(await HandlerErrorVoidTickets(model));

        return results;
    }

    private async Task<IEnumerable<Result>> HandlerVoidedTickets(VoidTicketsModel model, VoidTicketsQuery query)
    {
        if (!(model.Tickets?.Count() > 0))
        {
            return [];
        }

        await cashOutApiService.VoidBetForCashOutBasketball(model.Tickets);

        return await ContactUser(query, model);
    }

    private async Task<IEnumerable<Result>> HandlerErrorVoidTickets(VoidTicketsModel model)
    {
        var validation = model.Validation;
        if (validation.IsSuccessful)
        {
            return [];
        }

        var results = new List<Result> { new() { ErrorCode = validation.ErrorCode, ErrorMsg = validation.ErrorMsg } };
        await netPositionService.RollBackNetPosition(model.TicketsRollbackNetPosition);

        return results;
    }

    private async Task<IEnumerable<Result>> ContactUser(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var results = new List<Result>();
        try
        {
            results.AddRange(WarningMessage());
            await AfterVoid(query, model, results);
            results.InsertNegativeBalanceWarning(model.Validation.NegativeBalanceUsers);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(query.MatchId.ToString(), exception);
            results = [new Result { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message }];
        }

        return results;
    }

    private async Task AfterVoid(VoidTicketsQuery query, VoidTicketsModel model, List<Result> results)
    {
        if (model.Tickets.Any())
        {
            await voidTicketsService.SendMessage(query, model.Tickets);
            results.AddRange(await voidTicketsService.SendEmail(query, model));
            results.AddRange(await SendLetstalk(query, model));
        }
    }

    private List<Result> WarningMessage()
    {
        var result = new List<Result>();
        if (!string.IsNullOrEmpty(MessageCricket))
        {
            result.Add(new Result { ErrorCode = ErrorCode.ExecuteQueryAPIFail, ErrorMsg = MessageCricket });
        }

        return result;
    }

    private static void UpdateTimeViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        if (!data.Any())
        {
            return;
        }
        model.FromTransTime = data.Min(item => item.TransDate).ZoneManila();
        model.ToTransTime = data.Max(item => item.TransDate).ZoneManila();
    }

    private async Task<IEnumerable<Result>> SendLetstalk(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var ticketInfoForLetstalk = mapper.Map<TicketInfoForLetstalk>(query);
        return await notificationLetstalkService.SendToGroupVoidSettledBets(ticketInfoForLetstalk, model.Tickets);
    }
}