using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface EmailItQaService
{
    Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets,
        bool isFromAfterVoidService);
}

public class EmailItQaServiceImp(
    SitesEmailService sitesEmailService,
    EmailSimpleService emailSimpleService,
    VoidEmailContentService voidEmailContentService)
    : EmailItQaService
{
    public async Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItQa);
        var uusTickets = tickets.Where(s => s.Currency == CurrencyConstant.UusId);
        var mailRecord = await voidEmailContentService.Create(mailVoidViewModel.DeepClone(), site, uusTickets, EmailGroup.ItQa, isFromAfterVoidService);

        await emailSimpleService.Send(mailRecord, EmailGroup.ItQa);
    }
}