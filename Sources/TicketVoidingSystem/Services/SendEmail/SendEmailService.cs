using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail;

public interface SendEmailService
{
    Task<IEnumerable<Result>> ToDo();
}

public class SendEmailServiceImp : SendEmailService
{
    public Task<IEnumerable<Result>> ToDo()
    {
        throw new System.NotImplementedException();
    }

    public List<Result> SendEmail(EmailVoidModel model, List<TModel> tickets, bool isFromAfterVoidService = false)
    {
        var viewModel = CreateMailViewModel(model);
        var sites = GetSitesByCategory(model.IsLikelyAbnormalBet);
        var mailModel = CreateMailModel(viewModel, sites, tickets);

        var results = ToLicensees(mailModel, isFromAfterVoidService);

        SendToCashOut(viewModel, sites, tickets, isFromAfterVoidService);

        viewModel.NegativeBalanceUsers = model.NegativeBalanceUsers;
        SendToItQa(viewModel, sites, tickets, isFromAfterVoidService);

        viewModel.NegativeBalanceUsers = model.NegativeBalanceUsers;
        SendToItSupport(viewModel, sites, tickets, isFromAfterVoidService);

        return results;
    }

    private MailVoidViewModel<TViewModel> CreateMailViewModel(EmailVoidModel model)
    {
        return new MailVoidViewModel<TViewModel>
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

    public List<SiteEmail> GetSitesByCategory(bool isLikelyAbnormalBet)
    {
        return sitesService.GetSitesByCategory(isLikelyAbnormalBet);
    }
}