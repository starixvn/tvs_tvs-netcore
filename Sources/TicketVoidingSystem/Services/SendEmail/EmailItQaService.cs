using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail.Void;

namespace TicketVoidingSystem.Services.SendEmail;

public interface EmailItQaService
{
    Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets,
        bool isFromAfterVoidService);
}

public class EmailItQaServiceImp : EmailItQaService
{
    private readonly SitesEmailService sitesEmailService;
    private readonly EmailSimpleService emailSimpleService;
    private readonly VoidEmailContentService voidEmailContentService;

    public EmailItQaServiceImp(SitesEmailService sitesEmailService, EmailSimpleService emailSimpleService, VoidEmailContentService voidEmailContentService)
    {
        this.sitesEmailService = sitesEmailService;
        this.emailSimpleService = emailSimpleService;
        this.voidEmailContentService = voidEmailContentService;
    }

    public async Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItQa);
        var uusTickets = tickets.Where(s => s.Currency == CurrencyConstant.UusId);
        var mailRecord = await voidEmailContentService.Create(mailVoidViewModel.DeepClone(), site, uusTickets, EmailGroup.ItQa, isFromAfterVoidService);

        await emailSimpleService.Send(mailRecord, EmailGroup.ItQa);
    }
}