using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;

public interface RecoverTicketsService
{
    Task<RecoverTicketsModel> ExecuteQuery(Query query);

    void RemoveMessage(RecoverTicketsModel model);

    void SendEmail(RecoverTicketsModel model, Recover typeOfRecover);
}

public class RecoverTicketsServiceImp : RecoverTicketsService
{
    private readonly Repository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly SendMessageService sendMessageService;
    private readonly SitesEmailService sitesEmailService;
    private readonly EmailService emailService;

    public RecoverTicketsServiceImp(
        Repository repository,
        SessionService sessionService,
        LoggingService loggingService,
        SendMessageService sendMessageService,
        SitesEmailService sitesEmailService,
        EmailService emailService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
        this.sendMessageService = sendMessageService;
        this.sitesEmailService = sitesEmailService;
        this.emailService = emailService;
    }

    public async Task<RecoverTicketsModel> ExecuteQuery(Query query)
    {
        try
        {
            return await repository.RecoverTickets(query);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            var validation = new RecoverTicketsValidation
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

    public void RemoveMessage(RecoverTicketsModel model)
    {
        var transIds = string.Join(",", model.Tickets.Select(x => x.TransId));
        var userId = sessionService.UserId;
        sendMessageService.RemoveMessage(userId, transIds);
        sendMessageService.DeleteTransaction(model.Tickets.Select(x => new BetId { TransId = x.TransId.ToString(), MatchId = x.MatchId }));
    }

    public void SendEmail(RecoverTicketsModel model, Recover typeOfRecover)
    {
        var mailViewModel = CreateMailViewModel(model.Validation.NegativeBalanceUsers);
        var sites = sitesEmailService.GetSites();
        var csdRecoverSite = sitesEmailService.GetSiteByName(sites, Labels.CsdRecovery);
        var csdRecoverTickets = model.Tickets
            .Where(s => !s.IsItSupport || s.IsItSupport && s.CurrencyCode != CurrencyConstant.UusCode).ToList();
        var csdRecoverMailModel = CreateMailModel(csdRecoverSite, csdRecoverTickets, mailViewModel);
        emailService.SendEmail(csdRecoverMailModel, EmailGroup.Recover, typeOfRecover);

        mailViewModel.NegativeBalanceUsers = model.Validation.NegativeBalanceUsers;
        var itQaSite = sitesEmailService.GetSiteByName(sites, Labels.ItQa);
        var itQaTickets = model.Tickets
            .Where(s => s.IsItSupport && s.CurrencyCode == CurrencyConstant.UusCode).ToList();
        var itQaMailModel = CreateMailModel(itQaSite, itQaTickets, mailViewModel);
        emailService.SendEmail(itQaMailModel, EmailGroup.ItQa, typeOfRecover);

        mailViewModel.NegativeBalanceUsers = model.Validation.NegativeBalanceUsers;
        var itSupportSite = sitesEmailService.GetSiteByName(sites, Labels.ItSupport);
        var itSupportTickets = model.Tickets
            .Where(s => s.IsItSupport && s.CurrencyCode != CurrencyConstant.UusCode).ToList();
        var itSupportMailModel = CreateMailModel(itSupportSite, itSupportTickets, mailViewModel);
        emailService.SendEmail(itSupportMailModel, EmailGroup.ItSupport, typeOfRecover);
    }

    private MailRecoverViewModel<MailTicketViewModel> CreateMailViewModel(string negativeBalanceUsers)
    {
        return new MailRecoverViewModel<MailTicketViewModel>
        {
            ActorUsername = sessionService.UserName,
            DateTime = DateTime.Now,
            NegativeBalanceUsers = negativeBalanceUsers,
            TemplatePath = TemplateName.RecoverVirtualSports
        };
    }

    private static MailRecoverModel<MailTicketViewModel, RecoverTicketModel> CreateMailModel(
        SiteEmail site,
        IEnumerable<RecoverTicketModel> tickets,
        MailRecoverViewModel<MailTicketViewModel> viewModel)
    {
        return new MailRecoverModel<MailTicketViewModel, RecoverTicketModel>
        {
            Site = site,
            Tickets = tickets.ToList(),
            ViewModel = viewModel
        };
    }
}