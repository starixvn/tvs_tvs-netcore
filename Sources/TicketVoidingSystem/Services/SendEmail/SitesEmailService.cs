using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.SendEmail;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail;

public interface SitesEmailService
{
    Task<IEnumerable<SiteEmail>> GetSites();

    Task<IEnumerable<SiteEmail>> GetSitesByCategory(int issueTypeId);

    SiteEmail GetSiteByName(IEnumerable<SiteEmail> sites, string name);
}

public class SitesEmailServiceImp : SitesEmailService
{
    private readonly IDynamicRepository repository;

    public SitesEmailServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<SiteEmail>> GetSites()
    {
        var mailingListCriteria = new MailingListCriteria();
        var sites = (await repository.FetchAsync<SiteEmail>(mailingListCriteria)).ToList();
        sites = ExcludeTestSites(sites);
        HandleEmailConfiguration(sites);

        return sites;
    }

    public async Task<IEnumerable<SiteEmail>> GetSitesByCategory(int issueTypeId)
    {
        var category = Helper.IsLikelyAbnormalBet(issueTypeId) ? CategoryEmail.AbNormalBet : CategoryEmail.BetDeletionReport;
        var mailingListCriteria = new MailingListCriteria { CategoryId = category };
        var sites = (await repository.FetchAsync<SiteEmail>(mailingListCriteria)).ToList();
        sites = ExcludeTestSites(sites);
        HandleEmailConfiguration(sites);

        return sites;
    }

    private static List<SiteEmail> ExcludeTestSites(List<SiteEmail> sites)
    {
        var testSiteNames = new[] { "spondemo", "athena000" };
        return sites.Where(s => !testSiteNames.Any(t => t.Equals(s.Site, StringComparison.CurrentCultureIgnoreCase))).ToList();
    }

    private static void HandleEmailConfiguration(List<SiteEmail> sites)
    {
        var jsonPath = AppSettingService.AppSetting.FanexMailService.MailingList;
        var specialSites = Helper.DeserializeJsonFileToObject<List<SiteEmail>>(jsonPath);
        // 9999999 convert to hex (Underscores should be used to make large numbers readable -- code smell)
        const int SiteId = 0x98967F;
        var specialSite = specialSites.Single(x => x.SiteId == SiteId);
        specialSites.Remove(specialSite);

        sites.ForEach(site => site.BccList = specialSite.BccList);
        AddCCList(sites, specialSite);

        sites.AddRange(specialSites);
    }

    private static void AddCCList(List<SiteEmail> sites, SiteEmail specialSite)
    {
        if (!string.IsNullOrWhiteSpace(specialSite.CcList))
        {
            sites.ForEach(site =>
            {
                site.CcList = string.IsNullOrWhiteSpace(site.CcList) ? specialSite.CcList : $"{site.CcList};{specialSite.CcList}";
            });
        }
    }

    public SiteEmail GetSiteByName(IEnumerable<SiteEmail> sites, string name)
    {
        var item = sites.Where(site => site.Site.Equals(name)).ToList();
        return item.Count == 0 ? new SiteEmail() : item[0];
    }
}