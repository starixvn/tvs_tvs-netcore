using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;

public interface DuplicateTicketsEmailItQaService
{
    Task Send(DuplicateTicketsMailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<DuplicateTicketsRequestInfo> duplicateTickets);
}

public class DuplicateTicketsEmailItQaServiceImp : DuplicateTicketsEmailItQaService
{
    private readonly SitesEmailService sitesEmailService;
    private readonly EmailSimpleService emailSimpleService;
    private readonly DuplicateTicketsEmailContentService emailContentService;

    public DuplicateTicketsEmailItQaServiceImp(SitesEmailService sitesEmailService, EmailSimpleService emailSimpleService, DuplicateTicketsEmailContentService emailContentService)
    {
        this.sitesEmailService = sitesEmailService;
        this.emailSimpleService = emailSimpleService;
        this.emailContentService = emailContentService;
    }

    public async Task Send(DuplicateTicketsMailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<DuplicateTicketsRequestInfo> duplicateTickets)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItQa);
        var uusDuplicateTickets = duplicateTickets.Where(x => x.IsHasUusTickets);
        var mailReCord = emailContentService.Create(mailVoidViewModel.DeepClone(), site, uusDuplicateTickets, EmailGroup.ItQa);

        await emailSimpleService.Send(mailReCord, EmailGroup.ItQa);
    }
}