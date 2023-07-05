using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Void;

namespace TicketVoidingSystem.Services.SendEmail;

public interface EmailLicenseeService
{
    Task<IEnumerable<Result>> Send(MailVoidViewModel mailLicenseesModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService);
}

public class EmailLicenseeServiceImp : EmailLicenseeService
{
    private readonly VoidEmailContentService voidEmailContentService;
    private readonly FanexMailApiService fanexMailApiService;
    private readonly MailResultService mailResultService;

    public EmailLicenseeServiceImp(VoidEmailContentService voidEmailContentService, FanexMailApiService fanexMailApiService, MailResultService mailResultService)
    {
        this.voidEmailContentService = voidEmailContentService;
        this.fanexMailApiService = fanexMailApiService;
        this.mailResultService = mailResultService;
    }

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

        return CreateCombineResults(results, isFromAfterVoidService);
    }

    private async Task SendToSite(CombineMessageModel results, MailVoidViewModel mailLicenseesModel, SiteEmail site, IEnumerable<TicketEmailModel> ticketsInSite, bool isFromAfterVoidService)
    {
        var modelClone = mailLicenseesModel.DeepClone();
        modelClone.TemplatePath = TemplateEmailPath.VoidBetChinese;
        ReplaceMessageChinaViewLicensee(modelClone, site);

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
            fanexMailApiService.SendEmail(mailRecord);
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

    private static bool IsChinaViewAndSaBaLeague(MailVoidViewModel mailModel, SiteEmail site)
    {
        return mailModel.Match?.LeagueGroupId.IsLeagueGroupIdSaBa() == true && site.IsChinaView;
    }

    private static void ReplaceMessageChinaViewLicensee(MailVoidViewModel modelClone, SiteEmail site)
    {
        if (IsChinaViewAndSaBaLeague(modelClone, site))
        {
            var serializedContentChineseSimplified = JsonSerializer.Serialize(modelClone.Message.ContentChineseSimplified);
            var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified.Replace("沙巴", ""));

            modelClone.Message.ContentChineseSimplified = deSerializedContentChineseSimplified;
            modelClone.Message.ContentEnglish = modelClone.Message.ContentEnglish.Replace("SABA ", "");
        }
    }

    private IEnumerable<Result> CreateCombineResults(CombineMessageModel model, bool isFromAfterVoidService)
    {
        var results = model.Results;
        var successfulLicensees = string.Join(", ", model.SuccessfulLicensees);
        var failedLicensees = string.Join(", ", model.FailedLicensees);
        return isFromAfterVoidService ? mailResultService.InsertCombineLicenseesNameForAfterVoidService(results, successfulLicensees, failedLicensees)
            : mailResultService.InsertCombineLicenseesName(results, successfulLicensees, failedLicensees);
    }
}