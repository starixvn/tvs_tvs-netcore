using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

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

    public EmailItQaServiceImp(SitesEmailService sitesEmailService, EmailSimpleService emailSimpleService)
    {
        this.sitesEmailService = sitesEmailService;
        this.emailSimpleService = emailSimpleService;
    }

    public async Task Send(MailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var viewModel = mailVoidViewModel.DeepClone();
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItQa);
        var uusTickets = tickets.Where(s => s.Currency == CurrencyConstant.UusId);

        await emailSimpleService.Send(viewModel, site, uusTickets, EmailGroup.ItQa, isFromAfterVoidService);
    }
}