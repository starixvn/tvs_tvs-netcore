using System.Collections.Generic;
using System.Globalization;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.Subject;

public interface SubjectService
{
    string CreateVoid(MailViewModel mailViewModel, IEnumerable<TicketEmailModel> tickets, SiteEmail site, EmailGroup group, VoidType type);

    string CreateRecover(MailViewModel mailViewModel, EmailGroup group, RecoverType type);
}

public class SubjectServiceImp : SubjectService
{
    public string CreateVoid(MailViewModel mailViewModel, IEnumerable<TicketEmailModel> tickets, SiteEmail site, EmailGroup group, VoidType type)
    {
        var labelService = SubjectFactory.CreateVoid(type);
        var subject = group switch
        {
            EmailGroup.Csd => SubjectLicensee(mailViewModel, site, labelService.Licensee()),
            EmailGroup.CashOut => SubjectCashOut(mailViewModel, labelService.Licensee()),
            EmailGroup.ItQa => SubjectItQa(mailViewModel, tickets, labelService.It()),
            EmailGroup.ItSupport => SubjectItSupport(mailViewModel, tickets, labelService.It()),
            _ => ExceptionGroup.WrongGroup
        };

        return subject;
    }

    private static string SubjectLicensee(MailViewModel mailViewModel, SiteEmail site, string format)
    {
        var siteName = site.Site;
        var dateTime = mailViewModel.DateTime;
        return string.Format(CultureInfo.InvariantCulture, format, siteName.ToUpperInvariant(), dateTime);
    }

    private static string SubjectCashOut(MailViewModel mailViewModel, string format)
    {
        var siteName = StringResource.CashOut;
        var dateTime = mailViewModel.DateTime;
        return string.Format(CultureInfo.InvariantCulture, format, siteName, dateTime);
    }

    private static string SubjectItQa(MailViewModel mailViewModel, IEnumerable<TicketEmailModel> tickets, string format)
    {
        return SubjectItGroup(mailViewModel, tickets, StringResource.TestCurrency, format);
    }

    private static string SubjectItSupport(MailViewModel mailViewModel, IEnumerable<TicketEmailModel> tickets, string format)
    {
        return SubjectItGroup(mailViewModel, tickets, StringResource.RealCurrency, format);
    }

    private static string SubjectItGroup(MailViewModel mailViewModel, IEnumerable<TicketEmailModel> tickets,
        string prefix, string format)
    {
        var sites = tickets.JoinSites(s => s.Site);
        var dateTime = mailViewModel.DateTime;
        return string.Format(CultureInfo.InvariantCulture, format, prefix, sites.ToUpperInvariant(), dateTime);
    }

    public string CreateRecover(MailViewModel mailViewModel, EmailGroup group, RecoverType type)
    {
        var labels = SubjectFactory.CreateRecover(type);
        switch (group)
        {
            case EmailGroup.Recover:
            case EmailGroup.CashOut:
                return string.Format(CultureInfo.InvariantCulture, labels.Licensee(), mailViewModel.DateTime);

            case EmailGroup.ItQa:
                return string.Format(CultureInfo.InvariantCulture, labels.It(), StringResource.TestCurrency, mailViewModel.DateTime);

            case EmailGroup.ItSupport:
                return string.Format(CultureInfo.InvariantCulture, labels.It(), StringResource.RealCurrency, mailViewModel.DateTime);

            default:
                return ExceptionGroup.WrongGroup;
        }
    }
}