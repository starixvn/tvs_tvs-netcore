using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface EmailCashOutService
{
    Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService);
}

public class EmailCashOutServiceImp(
    SitesEmailService sitesEmailService,
    EmailSimpleService emailSimpleService,
    VoidEmailContentService voidEmailContentService)
    : EmailCashOutService
{
    public async Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.CashOut);
        var cashOutTickets = tickets.Where(s => s.IsCashOut);
        var mailRecord = await voidEmailContentService.Create(MessagePackCloner.Clone(mailVoidViewModel), site, cashOutTickets, EmailGroup.CashOut, isFromAfterVoidService);
        await emailSimpleService.Send(mailRecord, EmailGroup.CashOut);
    }
}