using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendMessage;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;

public interface DuplicateTicketsEmailLicenseeService
{
    Task<IEnumerable<Result>> Send(DuplicateTicketsMailVoidViewModel mailLicenseesModel, IEnumerable<SiteEmail> sites, IEnumerable<DuplicateTicketsRequestInfo> duplicateTickets);
}

public class DuplicateTicketsEmailLicenseeServiceImp(
    DuplicateTicketsEmailContentService emailContentService,
    FanexMailApiService fanexMailApiService,
    MailResultService mailResultService,
    SpecialPlatformService specialPlatformService)
    : DuplicateTicketsEmailLicenseeService
{
    public async Task<IEnumerable<Result>> Send(DuplicateTicketsMailVoidViewModel mailLicenseesModel, IEnumerable<SiteEmail> sites, IEnumerable<DuplicateTicketsRequestInfo> duplicateTickets)
    {
        var results = new CombineMessageModel();

        foreach (var site in sites)
        {
            var siteName = site.Site;
            var duplicateTicketsInSite = GetDuplicateTicketsInSite(duplicateTickets, siteName);

            if (duplicateTicketsInSite.Any())
            {
                await SendToSite(results, mailLicenseesModel, site, duplicateTicketsInSite);
            }
        }

        return mailResultService.CreateCombineResults(results, true);
    }

    private async Task SendToSite(CombineMessageModel results, DuplicateTicketsMailVoidViewModel mailLicenseesModel, SiteEmail site, IEnumerable<DuplicateTicketsRequestInfo> groupTicketsInSite)
    {
        var modelClone = MessagePackCloner.Clone(mailLicenseesModel);
        modelClone.TemplatePath = TemplateEmailPath.DuplicateTicketsVoidBetChinese;
        if (specialPlatformService.IsSiteSpecialPlatform(modelClone.Match, site))
        {
            modelClone.Message = specialPlatformService.RemoveSabaInMessageContent(modelClone.Match, modelClone.Message);
            modelClone.Match = specialPlatformService.RemoveSabaInMatchInfo(modelClone.Match);
        }

        if (!string.IsNullOrEmpty(site.ToList))
        {
            await ProcessSiteWithMailingAsync(modelClone, site, groupTicketsInSite, results);
        }
        else
        {
            ProcessSiteWithoutMailing(site, results);
        }
    }

    private static IEnumerable<DuplicateTicketsRequestInfo> GetDuplicateTicketsInSite(IEnumerable<DuplicateTicketsRequestInfo> groupTickets, string siteName)
    {
        return groupTickets.Where(t => t.EmailGroup.Equals(siteName, StringComparison.CurrentCultureIgnoreCase));
    }

    private async Task ProcessSiteWithMailingAsync(DuplicateTicketsMailVoidViewModel mailLicenseesModel, SiteEmail site,
        IEnumerable<DuplicateTicketsRequestInfo> groupTicketsInSite, CombineMessageModel results)
    {
        try
        {
            var mailReCord = emailContentService.Create(mailLicenseesModel, site, groupTicketsInSite, EmailGroup.Csd);
            fanexMailApiService.SendEmail(mailReCord, site);
            var listEmail = site.ToList.Split(';').Distinct().ToArray();
            results.Results.Add(mailResultService.CreateSuccess(site.Site, listEmail, true));
            results.SuccessfulLicensees.Add(site.Site);
        }
        catch (Exception exception)
        {
            await fanexMailApiService.WriteLog(EmailGroup.Csd, exception);
            results.Results.Add(mailResultService.CreateFail(site.Site, true));
            results.FailedLicensees.Add(site.Site);
        }
    }

    private void ProcessSiteWithoutMailing(SiteEmail site, CombineMessageModel results)
    {
        results.Results.Add(mailResultService.CreateFail(site.Site, true));
        results.FailedLicensees.Add(site.Site);
    }
}