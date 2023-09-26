using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services.GetTickets;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;
using SpecialDelete.VirtualSports.RecoverBet.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VirtualSports.RecoverBet.Services;

public interface RecoverBetService
{
    Task<RecoverTicketsViewModel> GetTickets(Query query);

    Task<IEnumerable<Result>> RecoverTickets(Query query);
}

public class RecoverBetServiceImp : RecoverBetService
{
    private readonly GetTicketsService getTicketsService;
    private readonly PagingService pagingService;
    private readonly RecoverTicketsService recoverTicketsService;
    private readonly NotificationService notificationService;
    private readonly LoggingService loggingService;

    public RecoverBetServiceImp(
        GetTicketsService getTicketsService,
        PagingService pagingService,
        RecoverTicketsService recoverTicketsService,
        NotificationService notificationService,
        LoggingService loggingService)
    {
        this.getTicketsService = getTicketsService;
        this.pagingService = pagingService;
        this.recoverTicketsService = recoverTicketsService;
        this.notificationService = notificationService;
        this.loggingService = loggingService;
    }

    public async Task<RecoverTicketsViewModel> GetTickets(Query query)
    {
        var viewModel = new RecoverTicketsViewModel();
        var model = await getTicketsService.ExecuteQuery(query);
        var groups = pagingService.Groups(model.Tickets.ToList(), ticket => ticket.GroupName);
        foreach (var group in groups)
        {
            viewModel.Groups.Add(await getTicketsService.AssignData(group, query.TypeOfRecover));
        }

        viewModel.InvalidTransIds = model.Validation.InvalidTransIds;
        viewModel.MovedTransIds = model.Validation.MovedTransIds;

        return viewModel;
    }

    public async Task<IEnumerable<Result>> RecoverTickets(Query query)
    {
        var results = new List<Result>();
        var model = await recoverTicketsService.ExecuteQuery(query);
        results.AddRange(await HandlerRecoveredTickets(query, model));
        results.AddRange(HandlerErrorRecoverTickets(model));

        return results;
    }

    private async Task<IEnumerable<Result>> HandlerRecoveredTickets(Query query, RecoverTicketsModel model)
    {
        var results = new List<Result>();
        if (!model.Tickets.Any())
        {
            return Enumerable.Empty<Result>();
        }

        results.AddRange(await ContactUser(model, query));

        return results;
    }

    private static IEnumerable<Result> HandlerErrorRecoverTickets(RecoverTicketsModel model)
    {
        if (model.Validation.IsSuccessful)
        {
            return Enumerable.Empty<Result>();
        }

        var results = new List<Result>
        {
            new Result { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg }
        };

        return results;
    }

    private async Task<IEnumerable<Result>> ContactUser(RecoverTicketsModel model, Query query)
    {
        try
        {
            recoverTicketsService.RemoveMessage(model);
            recoverTicketsService.SendEmail(model, query.TypeOfRecover);
            return CreateMessage(model, query.TypeOfRecover);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            return new List<Result>
            {
                new () { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message }
            };
        }
    }

    private IEnumerable<Result> CreateMessage(RecoverTicketsModel model, Recover typeOfRecover)
    {
        List<Result> results;
        string format;
        switch (typeOfRecover)
        {
            case Recover.Single:
                format = StringResource.WarningAutoReSettleMatchs;
                results = notificationService.WarningMessage(format, model.Validation.CompletedMatchIds);
                break;

            case Recover.MainParlay:
                format = StringResource.WarningAutoReSettleTransIds;
                results = notificationService.WarningMessage(format, model.Validation.ReCalculatedMainTransIds);
                break;

            default:
                format = StringResource.WarningAutoReSettleTransIdsOfMatch;
                results = notificationService.WarningMessage(format, model.Validation.ReCalculatedMainTransIds);
                break;
        }

        notificationService.AddNegativeBalance(results, model.Validation.NegativeBalanceUsers);

        return results;
    }
}