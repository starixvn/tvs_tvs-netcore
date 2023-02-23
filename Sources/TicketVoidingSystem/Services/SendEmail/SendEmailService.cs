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

namespace TicketVoidingSystem.Services.SendEmail;

public interface SendEmailService
{
    Task<IEnumerable<Result>> ToDo();
}

public class SendEmailServiceImp : SendEmailService
{
    private readonly SitesEmailService sitesEmailService;

    public SendEmailServiceImp(SitesEmailService sitesEmailService)
    {
        this.sitesEmailService = sitesEmailService;
    }

    public Task<IEnumerable<Result>> ToDo()
    {
        throw new System.NotImplementedException();
    }

    public async Task<List<Result>> SendEmail(EmailVoidModel model, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService = false)
    {
        var sites = await GetSitesByCategory(model.IsLikelyAbnormalBet);
        var viewModel = CreateMailViewModel(model);

        //var mailModel = CreateMailModel(viewModel, sites, tickets);

        var results = ToLicensees(viewModel, sites, tickets, isFromAfterVoidService);

        //SendToCashOut(viewModel, sites, tickets, isFromAfterVoidService);

        //viewModel.NegativeBalanceUsers = model.NegativeBalanceUsers;
        //SendToItQa(viewModel, sites, tickets, isFromAfterVoidService);

        //viewModel.NegativeBalanceUsers = model.NegativeBalanceUsers;
        //SendToItSupport(viewModel, sites, tickets, isFromAfterVoidService);
        return results;
    }

    public List<Result> ToLicensees(MailVoidViewModel mailLicenseesModel, IEnumerable<SiteEmail> sites, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        //var modelClone = mailLicenseesModel.DeepClone();
        var sitesClone = sites.DeepClone();
        var ticketsClone = tickets.DeepClone();
        var results = new CombineMessageModel();
        var negativeBalanceUsers = mailLicenseesModel.NegativeBalanceUsers;

        foreach (var site in sitesClone)
        {
            var modelClone = mailLicenseesModel.DeepClone();
            var siteName = site.Site;
            var ticketsInSite = ticketsClone.Where(t => t.EmailGroup.Equals(siteName, StringComparison.CurrentCultureIgnoreCase)).ToList();

            if (modelClone.Match != null && modelClone.Match.LeagueGroupId.IsLeagueGroupIdSaBa() && site.IsChinaView)
            {
                ReplaceMessageChinaViewLicensee(modelClone);
            }
            if (ticketsInSite.Count > 0)
            {
                modelClone.TemplatePath = TemplateEmailPath.VoidBetChinese;
                modelClone.NegativeBalanceUsers = negativeBalanceUsers;
                ToLicensee(mailModel, results, isFromAfterVoidService);
            }
        }

        return CreateCombineResults(results, isFromAfterVoidService);
    }

    private void ToLicensee(MailVoidModel<TViewModel, TModel> model, CombineMessageModel results, bool isFromAfterVoidService)
    {
        var site = model.Site;
        if (!string.IsNullOrEmpty(site.ToList))
        {
            SendEmailToSite(model, results, isFromAfterVoidService);
        }
        else
        {
            results.Results.Add(mailMessageService.CreateFail(site.Site, isFromAfterVoidService));
            results.FailedLicensees.Add(site.Site);
        }
    }

    private void SendEmailToSite(MailVoidModel<TViewModel, TModel> model, CombineMessageModel results, bool isFromAfterVoidService)
    {
        var site = model.Site;
        try
        {
            var mailRecord = recordService.Create(model, EmailGroup.Csd, isFromAfterVoidService);
            sendEmailService.SendEmail(mailRecord);
            var listEmail = site.ToList.Split(';').Distinct().ToArray();
            results.Results.Add(mailMessageService.CreateSuccess(site.Site, listEmail, isFromAfterVoidService));
            results.SuccessfulLicensees.Add(site.Site);
        }
        catch (Exception exception)
        {
            sendEmailService.WriteLog(EmailGroup.Csd, exception);
            results.Results.Add(mailMessageService.CreateFail(site.Site, isFromAfterVoidService));
            results.FailedLicensees.Add(site.Site);
        }
    }

    private MailVoidViewModel CreateMailViewModel(EmailVoidModel model)
    {
        return new MailVoidViewModel
        {
            TemplatePath = TemplateEmailPath.VoidBetChinese,
            Match = model.Match,
            DateTime = DateTime.Now,
            VoidReason = model.Reason,
            VoidReasonSC = model.ReasonSC,
            Message = model.Message,
            NegativeBalanceUsers = model.NegativeBalanceUsers,
            IsLikelyAbnormalBet = model.IsLikelyAbnormalBet,
            IsAbnormalAccount = model.IsAbnormalAccount,
            IsFilterByUserName = model.IsFilterByUsername,
        };
    }

    public async Task<IEnumerable<SiteEmail>> GetSitesByCategory(bool isLikelyAbnormalBet)
    {
        return await sitesEmailService.GetSitesByCategory(isLikelyAbnormalBet);
    }

    private static void ReplaceMessageChinaViewLicensee(MailVoidViewModel mailModel)
    {
        var serializedContentChineseSimplified = JsonSerializer.Serialize(mailModel.Message.ContentChineseSimplified);
        var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified.Replace("沙巴", ""));

        mailModel.Message.ContentChineseSimplified = deSerializedContentChineseSimplified;
        mailModel.Message.ContentEnglish = mailModel.Message.ContentEnglish.Replace("SABA ", "");
    }
}