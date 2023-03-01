using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail;

public interface EmailCashOutService
{
    Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService);
}

public class EmailCashOutServiceImp : EmailCashOutService
{
    private readonly SitesEmailService sitesEmailService;
    private readonly EmailSimpleService emailSimpleService;

    public EmailCashOutServiceImp(SitesEmailService sitesEmailService, EmailSimpleService emailSimpleService)
    {
        this.sitesEmailService = sitesEmailService;
        this.emailSimpleService = emailSimpleService;
    }

    public async Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var viewModel = mailVoidViewModel.DeepClone();
        var site = sitesEmailService.GetSiteByName(sites, StringResource.CashOut);
        var cashOutTickets = tickets.Where(s => s.IsCashOut);

        await emailSimpleService.Send(viewModel, site, cashOutTickets, EmailGroup.CashOut, isFromAfterVoidService);
    }
}