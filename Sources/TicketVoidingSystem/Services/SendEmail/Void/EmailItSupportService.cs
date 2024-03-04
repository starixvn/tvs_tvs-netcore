using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface EmailItSupportService
{
    Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets,
        bool isFromAfterVoidService);
}

public class EmailItSupportServiceImp : EmailItSupportService
{
    private readonly SitesEmailService sitesEmailService;
    private readonly EmailSimpleService emailSimpleService;
    private readonly VoidEmailContentService voidEmailContentService;

    public EmailItSupportServiceImp(SitesEmailService sitesEmailService, EmailSimpleService emailSimpleService, VoidEmailContentService voidEmailContentService)
    {
        this.sitesEmailService = sitesEmailService;
        this.emailSimpleService = emailSimpleService;
        this.voidEmailContentService = voidEmailContentService;
    }

    public async Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItSupport);
        var realTickets = tickets.Where(s => s.IsItSupport && s.Currency != CurrencyConstant.UusId);
        if (isFromAfterVoidService)
        {
            realTickets = realTickets.Where(s => s.IsITSupportCreatedRequest);
        }
        var mailRecord = await voidEmailContentService.Create(mailVoidViewModel.DeepClone(), site, realTickets, EmailGroup.ItSupport, isFromAfterVoidService);

        await emailSimpleService.Send(mailRecord, EmailGroup.ItSupport);
    }
}