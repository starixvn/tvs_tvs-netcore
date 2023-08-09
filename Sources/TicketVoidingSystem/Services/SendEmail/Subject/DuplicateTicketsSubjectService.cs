using System.Collections.Generic;
using System.Globalization;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.Subject;

public interface DuplicateTicketsSubjectService
{
    string CreateVoidDuplicateTickets(DuplicateTicketsMailVoidViewModel mailViewModel, IEnumerable<string> sites, SiteEmail site, EmailGroup group);
}

public class DuplicateTicketsSubjectServiceImp : DuplicateTicketsSubjectService
{
    public string CreateVoidDuplicateTickets(DuplicateTicketsMailVoidViewModel mailViewModel, IEnumerable<string> sites, SiteEmail site, EmailGroup group)
    {
        var labelService = new SubjectVoidDuplicateTicketsImp();
        var subject = group switch
        {
            EmailGroup.Csd => SubjectLicensee(mailViewModel, site, labelService.Licensee()),
            EmailGroup.ItQa => SubjectItQa(mailViewModel, sites, labelService.It()),
            EmailGroup.ItSupport => SubjectItSupport(mailViewModel, sites, labelService.It()),
            _ => ExceptionGroup.WrongGroup
        };

        return subject;
    }

    private static string SubjectLicensee(DuplicateTicketsMailVoidViewModel mailViewModel, SiteEmail site, string format)
    {
        var siteName = site.Site;
        return string.Format(CultureInfo.InvariantCulture, format, siteName.ToUpperInvariant(),
            mailViewModel.SportType.ContentChineseSimplified, mailViewModel.SportType.ContentEnglish);
    }

    private static string SubjectItQa(DuplicateTicketsMailVoidViewModel mailViewModel, IEnumerable<string> sites, string format)
    {
        return SubjectItGroup(mailViewModel, sites, StringResource.TestCurrency, format);
    }

    private static string SubjectItSupport(DuplicateTicketsMailVoidViewModel mailViewModel, IEnumerable<string> sites, string format)
    {
        return SubjectItGroup(mailViewModel, sites, StringResource.RealCurrency, format);
    }

    private static string SubjectItGroup(DuplicateTicketsMailVoidViewModel mailViewModel, IEnumerable<string> sites,
        string prefix, string format)
    {
        var joinedSite = sites.JoinSites(s => s);
        return string.Format(CultureInfo.InvariantCulture, format, prefix, joinedSite.ToUpperInvariant(),
            mailViewModel.SportType.ContentChineseSimplified, mailViewModel.SportType.ContentEnglish);
    }
}