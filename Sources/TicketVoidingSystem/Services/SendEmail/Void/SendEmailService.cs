using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface SendEmailService
{
    Task<IEnumerable<Result>> SendEmail(EmailVoidModel model, IEnumerable<TicketEmailModel> tickets,
        bool isFromAfterVoidService = false);
}

public class SendEmailServiceImp : SendEmailService
{
    private readonly SitesEmailService sitesEmailService;
    private readonly EmailLicenseeService emailLicenseeService;
    private readonly EmailCashOutService emailCashOutService;
    private readonly EmailItQaService emailItQaService;
    private readonly EmailItSupportService emailItSupportService;

    public SendEmailServiceImp(SitesEmailService sitesEmailService, EmailLicenseeService emailLicenseeService,
        EmailCashOutService emailCashOutService, EmailItQaService emailItQaService, EmailItSupportService emailItSupportService)
    {
        this.sitesEmailService = sitesEmailService;
        this.emailLicenseeService = emailLicenseeService;
        this.emailCashOutService = emailCashOutService;
        this.emailItQaService = emailItQaService;
        this.emailItSupportService = emailItSupportService;
    }

    public async Task<IEnumerable<Result>> SendEmail(EmailVoidModel model, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService = false)
    {
        var sites = await sitesEmailService.GetSitesByCategory(model.IssueTypeId);
        var viewModel = CreateMailViewModel(model);

        var results = await emailLicenseeService.Send(viewModel, sites, tickets, isFromAfterVoidService);
        await emailCashOutService.Send(viewModel, sites, tickets, isFromAfterVoidService);
        await emailItQaService.Send(viewModel, sites, tickets, isFromAfterVoidService);
        await emailItSupportService.Send(viewModel, sites, tickets, isFromAfterVoidService);

        return results;
    }

    private static MailVoidViewModel CreateMailViewModel(EmailVoidModel model)
    {
        return new MailVoidViewModel
        {
            TemplatePath = TemplateEmailPath.VoidBetChinese,
            Match = model.Match,
            DateTime = DateTimeOffset.Now.DateTime,
            VoidReason = model.Reason,
            VoidReasonSC = model.ReasonSC,
            Message = model.Message,
            NegativeBalanceUsers = model.NegativeBalanceUsers,
            IssueTypeId = model.IssueTypeId,
            IsFilterByUserName = model.IsFilterByUsername
        };
    }
}