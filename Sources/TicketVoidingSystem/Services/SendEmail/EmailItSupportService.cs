using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail;

public interface EmailItSupportService
{
    Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets,
        bool isFromAfterVoidService);
}

public class EmailItSupportServiceImp : EmailItSupportService
{
    private readonly SitesEmailService sitesEmailService;
    private readonly EmailSimpleService emailSimpleService;

    public EmailItSupportServiceImp(SitesEmailService sitesEmailService, EmailSimpleService emailSimpleService)
    {
        this.sitesEmailService = sitesEmailService;
        this.emailSimpleService = emailSimpleService;
    }

    public async Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var viewModel = mailVoidViewModel.DeepClone();
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItSupport);
        var uusTickets = tickets.Where(s => s.IsItSupport && s.Currency != CurrencyConstant.UusId);
        if (isFromAfterVoidService)
        {
            uusTickets = uusTickets.Where(s => s.IsITSupportCreatedRequest);
        }

        await emailSimpleService.Send(viewModel, site, uusTickets, EmailGroup.ItSupport, isFromAfterVoidService);
    }
}