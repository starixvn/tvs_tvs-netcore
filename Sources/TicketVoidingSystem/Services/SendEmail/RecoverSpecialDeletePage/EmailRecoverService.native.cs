using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;

namespace TicketVoidingSystem.Services.SendEmail.RecoverSpecialDeletePage;

public interface EmailRecoverService<TViewModel, TModel>
{
    Task<IEnumerable<SiteEmail>> GetSites();

    SiteEmail GetSiteByName(IEnumerable<SiteEmail> sites, string name);

    MailRecoverModel<TViewModel, TModel> CreateMailModel(MailRecoverViewModel<TViewModel> viewModel, SiteEmail site, List<TModel> tickets);

    void Send(MailRecoverModel<TViewModel, TModel> model, EmailGroup group);
}

public class EmailRecoverServiceImp<TViewModel, TModel>(
    FanexMailApiService fanexMailApiService,
    RecordRecoverService<TViewModel, TModel> recordService,
    SitesEmailService sitesService)
    : EmailRecoverService<TViewModel, TModel>
    where TModel : EmailRecoverSupport
{
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
            fanexMailApiService.SendEmail(mailRecord, null);
        }
        catch (Exception exception)
        {
            fanexMailApiService.WriteLog(group, exception);
        }
    }
}