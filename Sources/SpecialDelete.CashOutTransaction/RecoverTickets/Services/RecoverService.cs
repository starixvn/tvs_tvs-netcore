using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.Repositories;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using SpecialDelete.CashOutTransaction.RecoverTickets.Criteria;
using SpecialDelete.CashOutTransaction.RecoverTickets.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Services;

public interface RecoverService
{
    Task<SubmittedTicketsModel<RecoverTicketModel>> ExecuteQuery(RecoverTicketsQuery query);

    void RemoveMessage(string transIds);

    Task<Result> SendEmail(IEnumerable<RecoverTicketModel> tickets, string negativeBalanceUsers);
}

public class RecoverServiceImp(
    Repository repository,
    SessionService sessionService,
    LoggingService loggingService,
    SendMessageService sendMessageService,
    EmailRecoverService<MailTicketViewModel, RecoverTicketModel> emailService)
    : RecoverService
{
    public async Task<SubmittedTicketsModel<RecoverTicketModel>> ExecuteQuery(RecoverTicketsQuery query)
    {
        try
        {
            return await repository.SubmittedTickets<RecoverTicketModel, RecoverTicketsCriteria>(CreateCriteria(), query.Tickets);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            var validation = new SubmittedTicketsValidation
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };

            return new SubmittedTicketsModel<RecoverTicketModel>
            {
                Validation = validation,
                Tickets = Enumerable.Empty<RecoverTicketModel>()
            };
        }
    }

    private RecoverTicketsCriteria CreateCriteria()
    {
        return new RecoverTicketsCriteria
        {
            UserId = sessionService.UserId,
            Ip = sessionService.GetClientIp()
        };
    }

    public void RemoveMessage(string transIds)
    {
        var userId = sessionService.UserId;
        sendMessageService.RemoveMessage(userId, transIds);
    }

    public async Task<Result> SendEmail(IEnumerable<RecoverTicketModel> tickets, string negativeBalanceUsers)
    {
        var viewModel = CreateMailViewModel(negativeBalanceUsers);
        var sites = await emailService.GetSites();
        var realTicket = tickets.Where(s => !s.IsItSupport || s.IsItSupport && s.CurrencyCode != CurrencyConstant.UusCode).ToList();
        var csdRecoverSite = emailService.GetSiteByName(sites, StringResource.CsdRecovery);
        var csdRecoverModel = emailService.CreateMailModel(viewModel, csdRecoverSite, realTicket);
        emailService.Send(csdRecoverModel, EmailGroup.Recover);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        var itQaSite = emailService.GetSiteByName(sites, StringResource.ItQa);
        var itQaTickets = tickets.Where(s => s is { IsItSupport: true, CurrencyCode: CurrencyConstant.UusCode }).ToList();
        var itQaModel = emailService.CreateMailModel(viewModel, itQaSite, itQaTickets);
        emailService.Send(itQaModel, EmailGroup.ItQa);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        var itSupportSite = emailService.GetSiteByName(sites, StringResource.ItSupport);
        var itSupportTickets = tickets.Where(s => s.IsItSupport && s.CurrencyCode != CurrencyConstant.UusCode).ToList();
        var itSupportModel = emailService.CreateMailModel(viewModel, itSupportSite, itSupportTickets);
        emailService.Send(itSupportModel, EmailGroup.ItSupport);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        var cashOutSite = emailService.GetSiteByName(sites, StringResource.CashOut);
        var cashOutModel = emailService.CreateMailModel(viewModel, cashOutSite, tickets.ToList());
        emailService.Send(cashOutModel, EmailGroup.CashOut);

        return new Result { ErrorMsg = StringResource.RecoverBetSuccessfully };
    }

    private MailRecoverViewModel<MailTicketViewModel> CreateMailViewModel(string negativeBalanceUsers)
    {
        return new MailRecoverViewModel<MailTicketViewModel>
        {
            ActorUsername = sessionService.UserName,
            NegativeBalanceUsers = negativeBalanceUsers,
            DateTime = DateTimeOffset.Now.DateTime,
            TemplatePath = TemplateEmailPath.RecoverCashOut
        };
    }
}