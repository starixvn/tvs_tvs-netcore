using System.Collections.Generic;
using System.Globalization;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.Subject;

public interface SubjectService
{
    string CreateVoid(MailViewModel mailViewModel, IEnumerable<string> sites, SiteEmail site, EmailGroup group, VoidType type);

    string CreateRecover<T, U>(MailRecoverModel<T, U> model, EmailGroup group, RecoverType type);
}

public class SubjectServiceImp : SubjectService
{
    public string CreateVoid(MailViewModel mailViewModel, IEnumerable<string> sites, SiteEmail site, EmailGroup group, VoidType type)
    {
        var labelService = SubjectFactory.CreateVoid(type);
        var subject = group switch
        {
            EmailGroup.Csd => SubjectLicensee(mailViewModel, site, labelService.Licensee()),
            EmailGroup.CashOut => SubjectCashOut(mailViewModel, labelService.Licensee()),
            EmailGroup.ItQa => SubjectItQa(mailViewModel, sites, labelService.It()),
            EmailGroup.ItSupport => SubjectItSupport(mailViewModel, sites, labelService.It()),
            _ => ExceptionGroup.WrongGroup
        };

        return subject;
    }

    public string CreateRecover<T, U>(MailRecoverModel<T, U> model, EmailGroup group, RecoverType type)
    {
        var labels = SubjectFactory.CreateRecover(type);
        return group switch
        {
            EmailGroup.Recover => string.Format(labels.Licensee(), model.ViewModel.DateTime),
            EmailGroup.CashOut => string.Format(labels.Licensee(), model.ViewModel.DateTime),
            EmailGroup.ItQa => string.Format(labels.It(), StringResource.TestCurrency, model.ViewModel.DateTime),
            EmailGroup.ItSupport => string.Format(labels.It(), StringResource.RealCurrency, model.ViewModel.DateTime),
            _ => ExceptionGroup.WrongGroup
        };
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

    private static string SubjectItQa(MailViewModel mailViewModel, IEnumerable<string> sites, string format)
    {
        return SubjectItGroup(mailViewModel, sites, StringResource.TestCurrency, format);
    }

    private static string SubjectItSupport(MailViewModel mailViewModel, IEnumerable<string> sites, string format)
    {
        return SubjectItGroup(mailViewModel, sites, StringResource.RealCurrency, format);
    }

    private static string SubjectItGroup(MailViewModel mailViewModel, IEnumerable<string> sites,
        string prefix, string format)
    {
        var joinedSite = sites.JoinSites(s => s);
        var dateTime = mailViewModel.DateTime;
        return string.Format(CultureInfo.InvariantCulture, format, prefix, joinedSite.ToUpperInvariant(), dateTime);
    }
}