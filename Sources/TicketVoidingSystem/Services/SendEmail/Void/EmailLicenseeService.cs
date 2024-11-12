using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendMessage;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface EmailLicenseeService
{
    Task<IEnumerable<Result>> Send(MailVoidViewModel mailLicenseesModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService);
}

public class EmailLicenseeServiceImp(
    VoidEmailContentService voidEmailContentService,
    FanexMailApiService fanexMailApiService,
    MailResultService mailResultService,
    SpecialPlatformService specialPlatformService)
    : EmailLicenseeService
{
    public async Task<IEnumerable<Result>> Send(MailVoidViewModel mailLicenseesModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var results = new CombineMessageModel();

        foreach (var site in sites)
        {
            var siteName = site.Site;
            var ticketsInSite = GetTicketsInSite(tickets, siteName);

            if (ticketsInSite.Any())
            {
                await SendToSite(results, mailLicenseesModel, site, ticketsInSite, isFromAfterVoidService);
            }
        }

        return mailResultService.CreateCombineResults(results, isFromAfterVoidService);
    }

    private async Task SendToSite(CombineMessageModel results, MailVoidViewModel mailLicenseesModel, SiteEmail site, IEnumerable<TicketEmailModel> ticketsInSite, bool isFromAfterVoidService)
    {
        var modelClone = mailLicenseesModel.DeepClone();
        modelClone.TemplatePath = TemplateEmailPath.VoidBetChinese;
        if (specialPlatformService.IsSiteSpecialPlatform(modelClone.Match, site))
        {
            modelClone.Message = isFromAfterVoidService
                ? mailLicenseesModel.SpecialMessageAfterVoidService
                : specialPlatformService.RemoveSabaInMessageContent(modelClone.Match, modelClone.Message);
            modelClone.Match = specialPlatformService.RemoveSabaInMatchInfo(modelClone.Match);
        }

        if (!string.IsNullOrEmpty(site.ToList))
        {
            await ProcessSiteWithMailingAsync(modelClone, site, ticketsInSite, results, isFromAfterVoidService);
        }
        else
        {
            ProcessSiteWithoutMailing(site, results, isFromAfterVoidService);
        }
    }

    private static IEnumerable<TicketEmailModel> GetTicketsInSite(IEnumerable<TicketEmailModel> tickets, string siteName)
    {
        return tickets.Where(t => t.EmailGroup.Equals(siteName, StringComparison.CurrentCultureIgnoreCase));
    }

    private async Task ProcessSiteWithMailingAsync(MailVoidViewModel mailLicenseesModel, SiteEmail site,
        IEnumerable<TicketEmailModel> ticketsInSite, CombineMessageModel results, bool isFromAfterVoidService)
    {
        try
        {
            var mailRecord = await voidEmailContentService.Create(mailLicenseesModel, site, ticketsInSite, EmailGroup.Csd, isFromAfterVoidService);
            fanexMailApiService.SendEmail(mailRecord, site);
            var listEmail = site.ToList.Split(';').Distinct().ToArray();
            results.Results.Add(mailResultService.CreateSuccess(site.Site, listEmail, isFromAfterVoidService));
            results.SuccessfulLicensees.Add(site.Site);
        }
        catch (Exception exception)
        {
            await fanexMailApiService.WriteLog(EmailGroup.Csd, exception);
            results.Results.Add(mailResultService.CreateFail(site.Site, isFromAfterVoidService));
            results.FailedLicensees.Add(site.Site);
        }
    }

    private void ProcessSiteWithoutMailing(SiteEmail site, CombineMessageModel results, bool isFromAfterVoidService)
    {
        results.Results.Add(mailResultService.CreateFail(site.Site, isFromAfterVoidService));
        results.FailedLicensees.Add(site.Site);
    }
}