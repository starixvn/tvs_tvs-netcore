using SpecialDelete.RecoverByBetId.Models;
using SpecialDelete.RecoverByBetId.Repositories;
using SpecialDelete.RecoverByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.Recover;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.RecoverByBetId.Services.RecoverTickets;

public interface RecoverTicketsService
{
    Task<RecoverTicketsModel> RecoverTickets(RecoverTicketsQuery query);

    Task RemoveMessage(string transIds);

    Task SendEmail(IEnumerable<RecoverTicketModel> tickets, string negativeBalanceUsers);

    IEnumerable<Result> CreateMessage(RecoverTicketsModel model);
}

public class RecoverTicketsServiceImp : RecoverTicketsService
{
    private readonly Repository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly SendMessageService sendMessageService;
    private readonly EmailRecoverService<MailTicketViewModel, RecoverTicketModel> emailService;

    public RecoverTicketsServiceImp(
        Repository repository,
        SessionService sessionService,
        LoggingService loggingService,
        SendMessageService sendMessageService,
        EmailRecoverService<MailTicketViewModel, RecoverTicketModel> emailService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
        this.sendMessageService = sendMessageService;
        this.emailService = emailService;
    }

    public async Task<RecoverTicketsModel> RecoverTickets(RecoverTicketsQuery query)
    {
        try
        {
            return await repository.RecoverTickets(query.Tickets);
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
                Tickets = Enumerable.Empty<RecoverTicketModel>()
            };
        }
    }

    public async Task RemoveMessage(string transIds)
    {
        var userId = sessionService.UserId;
        await sendMessageService.RemoveMessage(userId, transIds);
    }

    public async Task SendEmail(IEnumerable<RecoverTicketModel> tickets, string negativeBalanceUsers)
    {
        var viewModel = CreateMailViewModel(negativeBalanceUsers);
        var sites = await emailService.GetSites();
        var realTicket = tickets.Where(s => !s.IsItSupport || s.IsItSupport && s.Currency != CurrencyConstant.UusId).ToList();
        var csdRecoverSite = emailService.GetSiteByName(sites, StringResource.CsdRecovery);
        var csdRecoverModel = emailService.CreateMailModel(viewModel, csdRecoverSite, realTicket);
        emailService.Send(csdRecoverModel, EmailGroup.Recover);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        var itQaSite = emailService.GetSiteByName(sites, StringResource.ItQa);
        var itQaTickets = tickets.Where(s => s.IsItSupport && s.Currency == CurrencyConstant.UusId).ToList();
        var itQaModel = emailService.CreateMailModel(viewModel, itQaSite, itQaTickets);
        emailService.Send(itQaModel, EmailGroup.ItQa);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        var itSupportSite = emailService.GetSiteByName(sites, StringResource.ItSupport);
        var itSupportTickets = tickets.Where(s => s.IsItSupport && s.Currency != CurrencyConstant.UusId).ToList();
        var itSupportModel = emailService.CreateMailModel(viewModel, itSupportSite, itSupportTickets);
        emailService.Send(itSupportModel, EmailGroup.ItSupport);
    }

    private MailRecoverViewModel<MailTicketViewModel> CreateMailViewModel(string negativeBalanceUsers)
    {
        return new MailRecoverViewModel<MailTicketViewModel>
        {
            ActorUsername = sessionService.UserName,
            NegativeBalanceUsers = negativeBalanceUsers,
            DateTime = DateTime.Now,
            TemplatePath = TemplateEmailPath.RecoverByBetId
        };
    }

    public IEnumerable<Result> CreateMessage(RecoverTicketsModel model)
    {
        var results = new List<Result>
        {
            new() { ErrorMsg =  StringResource.RecoverBetSuccessfully }
        };
        if (!string.IsNullOrWhiteSpace(model.Validation.ReCalcMatches))
        {
            var result = new Result
            {
                ErrorCode = 1,
                ErrorMsg = string.Format(StringResource.WarningRecoverReCalcBitcoinMatchs, model.Validation.ReCalcMatches)
            };
            results.Add(result);
        }

        return results;
    }
}