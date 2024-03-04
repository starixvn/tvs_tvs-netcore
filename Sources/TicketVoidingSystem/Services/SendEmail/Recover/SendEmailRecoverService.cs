using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.Recover;

public interface SendEmailRecoverService
{
    Task SendEmail(MailRecoverViewModel viewModel, IEnumerable<TicketRecoverEmailModel> tickets);
}

public class SendEmailRecoverServiceImp : SendEmailRecoverService
{
    private readonly SitesEmailService sitesEmailService;
    private readonly RecoverEmailContentService recoverEmailContentService;
    private readonly EmailSimpleService emailSimpleService;

    public SendEmailRecoverServiceImp(SitesEmailService sitesEmailService, RecoverEmailContentService recoverEmailContentService, EmailSimpleService emailSimpleService)
    {
        this.sitesEmailService = sitesEmailService;
        this.recoverEmailContentService = recoverEmailContentService;
        this.emailSimpleService = emailSimpleService;
    }

    public async Task SendEmail(MailRecoverViewModel viewModel, IEnumerable<TicketRecoverEmailModel> tickets)
    {
        var sites = await sitesEmailService.GetSites();
        SendMailCSD(sites, tickets, viewModel.DeepClone());
        SendMailItQa(sites, tickets, viewModel.DeepClone());
        SendMailItSupport(sites, tickets, viewModel.DeepClone());
    }

    private void SendMailCSD(IEnumerable<SiteEmail> sites, IEnumerable<TicketRecoverEmailModel> tickets, MailRecoverViewModel viewModel)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.CsdRecovery);
        var data = tickets.Where(t => t.IsCsd).ToList();
        var mailRecord = recoverEmailContentService.Create(viewModel, data, site, EmailGroup.Recover);
        emailSimpleService.Send(mailRecord, EmailGroup.Recover);
    }

    private void SendMailItQa(IEnumerable<SiteEmail> sites, IEnumerable<TicketRecoverEmailModel> tickets, MailRecoverViewModel viewModel)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItQa);
        var data = tickets.Where(t => t.IsItQa).ToList();
        var mailRecord = recoverEmailContentService.Create(viewModel, data, site, EmailGroup.ItQa);
        emailSimpleService.Send(mailRecord, EmailGroup.ItQa);
    }

    private void SendMailItSupport(IEnumerable<SiteEmail> sites, IEnumerable<TicketRecoverEmailModel> tickets, MailRecoverViewModel viewModel)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItSupport);
        var data = tickets.Where(t => t.IsItSupport).ToList();
        var mailRecord = recoverEmailContentService.Create(viewModel, data, site, EmailGroup.ItSupport);
        emailSimpleService.Send(mailRecord, EmailGroup.ItSupport);
    }
}