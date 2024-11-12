using SpecialDelete.RecoverBet.Models;
using SpecialDelete.RecoverBet.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.RecoverBet.Services.RecoverTickets;

public interface IRecoverTicketsService
{
    Task<RecoverTicketsModel> RecoverTickets(IEnumerable<BetId> tickets, IEnumerable<BetId> cricketTickets);

    void RemoveMessage(RecoverTicketsModel model);

    Task SendEmail(List<RecoverTicketModel> tickets, string negativeBalanceUsers);

    IEnumerable<Result> CreateResultMessage(string settledTransIds, bool isRequiredResettleMatch);
}

public class RecoverTicketsService(
    IRepository repository,
    SessionService sessionService,
    LoggingService loggingService,
    SendMessageService sendMessageService,
    IHandleEmailService emailService)
    : IRecoverTicketsService
{
    public async Task<RecoverTicketsModel> RecoverTickets(IEnumerable<BetId> tickets, IEnumerable<BetId> cricketTickets)
    {
        try
        {
            return await repository.RecoverTickets(tickets, cricketTickets);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            var validation = new RecoverTicketValidation
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };
            return new RecoverTicketsModel
            {
                Validation = validation,
                Tickets = []
            };
        }
    }

    public void RemoveMessage(RecoverTicketsModel model)
    {
        var transIds = string.Join(",", model.Tickets.Select(x => x.TransId));
        var userId = sessionService.UserId;
        sendMessageService.RemoveMessage(userId, $"{transIds}");
        sendMessageService.DeleteTransaction(model.Tickets.Select(x => new BetId { TransId = x.TransId.ToString(), MatchId = x.MatchId }));
    }

    public async Task SendEmail(List<RecoverTicketModel> tickets, string negativeBalanceUsers)
    {
        var viewModel = emailService.CreateMailViewModel(negativeBalanceUsers);
        var sites = await emailService.GetSites();
        emailService.SendMailCSD(sites, tickets, viewModel);
        viewModel.NegativeBalanceUsers = string.Empty;
        emailService.SendMailCashOut(sites, tickets, viewModel);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        emailService.SendMailItQa(sites, tickets, viewModel);
        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        emailService.SendMailItSupport(sites, tickets, viewModel);
    }

    public IEnumerable<Result> CreateResultMessage(string settledTransIds, bool isRequiredResettleMatch)
    {
        var results = new List<Result> { new() { ErrorMsg = StringResource.RecoverBetSuccessfully } };
        settledTransIds = string.IsNullOrEmpty(settledTransIds) ? string.Empty : settledTransIds.Replace(",", ", ");
        results.Add(WarningMessage(settledTransIds, isRequiredResettleMatch));

        return results;
    }

    private static Result WarningMessage(string settledMainTrainIds, bool isRequiredResettleMatch)
    {
        var messageReturnRunning = isRequiredResettleMatch ?
            new Result { ErrorMsg = StringResource.RecoverSportBookReturnRunningRequiredResettleMatches } :
            new Result { ErrorMsg = StringResource.RecoverSportBookReturnRunning };
        return string.IsNullOrWhiteSpace(settledMainTrainIds) ? messageReturnRunning :
            new Result { ErrorMsg = string.Format(StringResource.WarningAutoReSettleTransIds, settledMainTrainIds) };
    }
}