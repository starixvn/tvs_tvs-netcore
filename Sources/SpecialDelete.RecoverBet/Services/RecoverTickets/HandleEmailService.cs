using SpecialDelete.RecoverBet.Models;
using SpecialDelete.RecoverBet.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.Recover;

namespace SpecialDelete.RecoverBet.Services.RecoverTickets;

public interface IHandleEmailService
{
    Task<IEnumerable<SiteEmail>> GetSites();

    MailRecoverViewModel<MailTicketViewModel> CreateMailViewModel(string negativeBalanceUsers);

    void SendMailCSD(IEnumerable<SiteEmail> sites, List<RecoverTicketModel> tickets, MailRecoverViewModel<MailTicketViewModel> viewModel);

    void SendMailCashOut(IEnumerable<SiteEmail> sites, List<RecoverTicketModel> tickets, MailRecoverViewModel<MailTicketViewModel> viewModel);

    void SendMailItQa(IEnumerable<SiteEmail> sites, List<RecoverTicketModel> tickets, MailRecoverViewModel<MailTicketViewModel> viewModel);

    void SendMailItSupport(IEnumerable<SiteEmail> sites, List<RecoverTicketModel> tickets, MailRecoverViewModel<MailTicketViewModel> viewModel);
}

public class HandleEmailService : IHandleEmailService
{
    private readonly SessionService sessionService;
    private readonly EmailRecoverService<MailTicketViewModel, RecoverTicketModel> emailService;

    public HandleEmailService(
        EmailRecoverService<MailTicketViewModel, RecoverTicketModel> emailService,
        SessionService sessionService)
    {
        this.emailService = emailService;
        this.sessionService = sessionService;
    }

    public async Task<IEnumerable<SiteEmail>> GetSites()
    {
        return await emailService.GetSites();
    }

    public MailRecoverViewModel<MailTicketViewModel> CreateMailViewModel(string negativeBalanceUsers)
    {
        return new MailRecoverViewModel<MailTicketViewModel>
        {
            ActorUsername = sessionService.UserName,
            NegativeBalanceUsers = negativeBalanceUsers,
            DateTime = DateTimeOffset.Now.DateTime,
            TemplatePath = TemplateEmailPath.RecoverBet
        };
    }

    public void SendMailCSD(IEnumerable<SiteEmail> sites, List<RecoverTicketModel> tickets, MailRecoverViewModel<MailTicketViewModel> viewModel)
    {
        var site = emailService.GetSiteByName(sites, StringResource.CsdRecovery);
        var data = tickets.Where(t => t.IsReal).ToList();
        var model = emailService.CreateMailModel(viewModel, site, data);
        emailService.Send(model, EmailGroup.Recover);
    }

    public void SendMailCashOut(IEnumerable<SiteEmail> sites, List<RecoverTicketModel> tickets, MailRecoverViewModel<MailTicketViewModel> viewModel)
    {
        var site = emailService.GetSiteByName(sites, StringResource.CashOut);
        var data = tickets.Where(t => t.IsCashOut).ToList();
        var model = emailService.CreateMailModel(viewModel, site, data);
        emailService.Send(model, EmailGroup.CashOut);
    }

    public void SendMailItQa(IEnumerable<SiteEmail> sites, List<RecoverTicketModel> tickets, MailRecoverViewModel<MailTicketViewModel> viewModel)
    {
        var site = emailService.GetSiteByName(sites, StringResource.ItQa);
        var data = tickets.Where(t => t.IsItQa).ToList();
        var model = emailService.CreateMailModel(viewModel, site, data);
        emailService.Send(model, EmailGroup.ItQa);
    }

    public void SendMailItSupport(IEnumerable<SiteEmail> sites, List<RecoverTicketModel> tickets, MailRecoverViewModel<MailTicketViewModel> viewModel)
    {
        var site = emailService.GetSiteByName(sites, StringResource.ItSupport);
        var data = tickets.Where(t => t.IsItSupport).ToList();
        var model = emailService.CreateMailModel(viewModel, site, data);
        emailService.Send(model, EmailGroup.ItSupport);
    }
}