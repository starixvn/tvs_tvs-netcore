using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.Recover;

public interface EmailRecoverService<TViewModel, TModel>
{
    Task<IEnumerable<SiteEmail>> GetSites();

    SiteEmail GetSiteByName(IEnumerable<SiteEmail> sites, string name);

    MailRecoverModel<TViewModel, TModel> CreateMailModel(MailRecoverViewModel<TViewModel> viewModel, SiteEmail site, List<TModel> tickets);

    void Send(MailRecoverModel<TViewModel, TModel> model, EmailGroup group);

    void SendToCSDRecover(List<TModel> tickets, List<SiteEmail> sites, MailRecoverViewModel<TViewModel> viewModel);

    void SendToITQa(List<TModel> tickets, List<SiteEmail> sites, MailRecoverViewModel<TViewModel> viewModel);

    void SendToITSupport(List<TModel> tickets, List<SiteEmail> sites, MailRecoverViewModel<TViewModel> viewModel);
}

public class EmailRecoverServiceImp<TViewModel, TModel> : EmailRecoverService<TViewModel, TModel> where TModel : EmailRecoverSupport
{
    private readonly FanexMailApiService fanexMailApiService;
    private readonly RecordRecoverService<TViewModel, TModel> recordService;
    private readonly SitesEmailService sitesService;

    public EmailRecoverServiceImp(
        FanexMailApiService fanexMailApiService,
        RecordRecoverService<TViewModel, TModel> recordService,
        SitesEmailService sitesService)
    {
        this.fanexMailApiService = fanexMailApiService;
        this.recordService = recordService;
        this.sitesService = sitesService;
    }

    public async Task<IEnumerable<SiteEmail>> GetSites()
    {
        return await sitesService.GetSites();
    }

    public SiteEmail GetSiteByName(IEnumerable<SiteEmail> sites, string name)
    {
        return sitesService.GetSiteByName(sites, name);
    }

    public MailRecoverModel<TViewModel, TModel> CreateMailModel(MailRecoverViewModel<TViewModel> viewModel, SiteEmail site, List<TModel> tickets)
    {
        return new MailRecoverModel<TViewModel, TModel> { ViewModel = viewModel, Site = site, Tickets = tickets };
    }

    public void Send(MailRecoverModel<TViewModel, TModel> model, EmailGroup group)
    {
        try
        {
            var mailRecord = recordService.Create(model, group);
            fanexMailApiService.SendEmail(mailRecord);
        }
        catch (Exception exception)
        {
            fanexMailApiService.WriteLog(group, exception);
        }
    }

    public void SendToCSDRecover(List<TModel> tickets, List<SiteEmail> sites, MailRecoverViewModel<TViewModel> viewModel)
    {
        var realTicket = tickets.Where(s => !s.IsItSupport || s.IsItSupport && s.CurrencyCode != CurrencyConstant.UusCode).ToList();
        var site = GetSiteByName(sites, StringResource.CsdRecovery);
        var model = CreateMailModel(viewModel, site, realTicket);
        Send(model, EmailGroup.Recover);
    }

    public void SendToITQa(List<TModel> tickets, List<SiteEmail> sites, MailRecoverViewModel<TViewModel> viewModel)
    {
        var itQaTickets = tickets.Where(s => s.IsItSupport && s.CurrencyCode == CurrencyConstant.UusCode).ToList();
        var site = GetSiteByName(sites, StringResource.ItQa);
        var model = CreateMailModel(viewModel, site, itQaTickets);
        Send(model, EmailGroup.ItQa);
    }

    public void SendToITSupport(List<TModel> tickets, List<SiteEmail> sites, MailRecoverViewModel<TViewModel> viewModel)
    {
        var itSupportTickets = tickets.Where(s => s.IsItSupport && s.CurrencyCode != CurrencyConstant.UusCode).ToList();
        var Site = GetSiteByName(sites, StringResource.ItSupport);
        var model = CreateMailModel(viewModel, Site, itSupportTickets);
        Send(model, EmailGroup.ItSupport);
    }
}