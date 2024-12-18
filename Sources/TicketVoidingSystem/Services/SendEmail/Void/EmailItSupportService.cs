using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface EmailItSupportService
{
    Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets,
        bool isFromAfterVoidService);
}

public class EmailItSupportServiceImp(
    SitesEmailService sitesEmailService,
    EmailSimpleService emailSimpleService,
    VoidEmailContentService voidEmailContentService)
    : EmailItSupportService
{
    public async Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItSupport);
        var realTickets = tickets.Where(s => s.IsItSupport && s.Currency != CurrencyConstant.UusId);
        if (isFromAfterVoidService)
        {
            realTickets = realTickets.Where(s => s.IsITSupportCreatedRequest);
        }
        var mailRecord = await voidEmailContentService.Create(MessagePackCloner.Clone(mailVoidViewModel), site, realTickets, EmailGroup.ItSupport, isFromAfterVoidService);

        await emailSimpleService.Send(mailRecord, EmailGroup.ItSupport);
    }
}