using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface EmailCashOutService
{
    Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService);
}

public class EmailCashOutServiceImp : EmailCashOutService
{
    private readonly SitesEmailService sitesEmailService;
    private readonly EmailSimpleService emailSimpleService;
    private readonly VoidEmailContentService voidEmailContentService;

    public EmailCashOutServiceImp(SitesEmailService sitesEmailService, EmailSimpleService emailSimpleService, VoidEmailContentService voidEmailContentService)
    {
        this.sitesEmailService = sitesEmailService;
        this.emailSimpleService = emailSimpleService;
        this.voidEmailContentService = voidEmailContentService;
    }

    public async Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.CashOut);
        var cashOutTickets = tickets.Where(s => s.IsCashOut);
        var mailRecord = await voidEmailContentService.Create(mailVoidViewModel.DeepClone(), site, cashOutTickets, EmailGroup.CashOut, isFromAfterVoidService);
        await emailSimpleService.Send(mailRecord, EmailGroup.CashOut);
    }
}