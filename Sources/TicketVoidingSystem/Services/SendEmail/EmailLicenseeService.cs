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
        var negativeBalanceUsers = mailLicenseesModel.NegativeBalanceUsers;

        foreach (var site in sites)
        {
            var modelClone = mailLicenseesModel.DeepClone();
            var siteName = site.Site;
            var ticketsInSite = tickets.Where(t => t.EmailGroup.Equals(siteName, StringComparison.CurrentCultureIgnoreCase)).ToList();

            if (modelClone.Match != null && modelClone.Match.LeagueGroupId.IsLeagueGroupIdSaBa() && site.IsChinaView)
            {
                ReplaceMessageChinaViewLicensee(modelClone);
            }
            if (ticketsInSite.Count > 0)
            {
                modelClone.TemplatePath = TemplateEmailPath.VoidBetChinese;
                modelClone.NegativeBalanceUsers = negativeBalanceUsers;
                await Send(modelClone, site, tickets, results, isFromAfterVoidService);
            }
        }

        return CreateCombineResults(results, isFromAfterVoidService);
    }

    private async Task Send(MailVoidViewModel mailLicenseesModel, SiteEmail site, IEnumerable<TicketEmailModel> tickets, CombineMessageModel results, bool isFromAfterVoidService)
    {
        if (!string.IsNullOrEmpty(site.ToList))
        {
            await SendEmailToSite(mailLicenseesModel, site, tickets, results, isFromAfterVoidService);
        }
        else
        {
            results.Results.Add(mailResultService.CreateFail(site.Site, isFromAfterVoidService));
            results.FailedLicensees.Add(site.Site);
        }
    }

    private async Task SendEmailToSite(MailVoidViewModel mailLicenseesModel, SiteEmail site, IEnumerable<TicketEmailModel> tickets, CombineMessageModel results, bool isFromAfterVoidService)
    {
        try
        {
            var mailRecord = await voidEmailContentService.Create(mailLicenseesModel, site, tickets, EmailGroup.Csd, isFromAfterVoidService);
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

    private static void ReplaceMessageChinaViewLicensee(MailVoidViewModel mailModel)
    {
        var serializedContentChineseSimplified = JsonSerializer.Serialize(mailModel.Message.ContentChineseSimplified);
        var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified.Replace("沙巴", ""));

        mailModel.Message.ContentChineseSimplified = deSerializedContentChineseSimplified;
        mailModel.Message.ContentEnglish = mailModel.Message.ContentEnglish.Replace("SABA ", "");
    }

    private List<Result> CreateCombineResults(CombineMessageModel model, bool isFromAfterVoidService)
    {
        var results = model.Results;
        var successfulLicensees = string.Join(", ", model.SuccessfulLicensees);
        var failedLicensees = string.Join(", ", model.FailedLicensees);
        return isFromAfterVoidService ? mailResultService.InsertCombineLicenseesNameForAfterVoidService(results, successfulLicensees, failedLicensees)
            : mailResultService.InsertCombineLicenseesName(results, successfulLicensees, failedLicensees);
    }
}