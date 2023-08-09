using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;

public interface DuplicateTicketsEmailItSupportService
{
    Task Send(DuplicateTicketsMailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<DuplicateTicketsRequestInfo> duplicateTickets);
}

public class DuplicateTicketsEmailItSupportServiceImp : DuplicateTicketsEmailItSupportService
{
    private readonly SitesEmailService sitesEmailService;
    private readonly EmailSimpleService emailSimpleService;
    private readonly DuplicateTicketsEmailContentService emailContentService;

    public DuplicateTicketsEmailItSupportServiceImp(SitesEmailService sitesEmailService, EmailSimpleService emailSimpleService, DuplicateTicketsEmailContentService emailContentService)
    {
        this.sitesEmailService = sitesEmailService;
        this.emailSimpleService = emailSimpleService;
        this.emailContentService = emailContentService;
    }

    public async Task Send(DuplicateTicketsMailVoidViewModel mailVoidViewModel, IEnumerable<SiteEmail> sites, IEnumerable<DuplicateTicketsRequestInfo> duplicateTickets)
    {
        var site = sitesEmailService.GetSiteByName(sites, StringResource.ItQa);
        var realDuplicateTickets = duplicateTickets.Where(x
            => x.IsItSupport && x.IsITSupportCreatedRequest && !x.IsHasUusTickets);
        var mailReCord = emailContentService.Create(mailVoidViewModel.DeepClone(), site, realDuplicateTickets, EmailGroup.ItSupport);

        await emailSimpleService.Send(mailReCord, EmailGroup.ItSupport);
    }
}