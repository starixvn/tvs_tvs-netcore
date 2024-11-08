using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.SendEmail;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendMessage;
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
    private readonly SpecialPlatformService specialPlatformService;

    public SitesEmailServiceImp(IDynamicRepository repository, SpecialPlatformService specialPlatformService)
    {
        this.repository = repository;
        this.specialPlatformService = specialPlatformService;
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
        var category = Helper.IsAbnormalBet(issueTypeId) ? CategoryEmail.AbNormalBet : CategoryEmail.BetDeletionReport;
        var mailingListCriteria = new MailingListCriteria { CategoryId = category };
        var sites = (await repository.FetchAsync<SiteEmail>(mailingListCriteria)).ToList();
        sites = ExcludeTestSites(sites);
        HandleEmailConfiguration(sites);

        return sites;
    }

    private static List<SiteEmail> ExcludeTestSites(IEnumerable<SiteEmail> sites)
    {
        var testSiteNames = new[] { "spondemo", "athena000" };
        return sites.Where(s => !Array.Exists(testSiteNames, t => t.Equals(s.Site, StringComparison.CurrentCultureIgnoreCase)))
            .ToList();
    }

    private void HandleEmailConfiguration(List<SiteEmail> sites)
    {
        var jsonPath = AppSettingService.AppSetting.FanexMailService.MailingList;
        var specialSites = Helper.DeserializeJsonFileToObject<List<SiteEmail>>(jsonPath);
        var (csdNormalSite, csdJollySportSite) = GetCSDSites(specialSites);
        UpdateBccList(sites, csdNormalSite);
        AddCCList(sites, csdNormalSite, csdJollySportSite);
        RemoveSpecialSites(specialSites, csdNormalSite, csdJollySportSite);
        sites.AddRange(specialSites);
    }

    private static (SiteEmail, SiteEmail) GetCSDSites(List<SiteEmail> specialSites)
    {
        const int csdNormalSiteId = 9_999_999; //9999999
        const int csdJollySportsSiteId = 9_000_000; //9000000
        var csdNormal = specialSites.Single(x => x.SiteId == csdNormalSiteId);
        var csdJollySport = specialSites.Single(x => x.SiteId == csdJollySportsSiteId);
        return (csdNormal, csdJollySport);
    }

    private static void RemoveSpecialSites(List<SiteEmail> specialSites, SiteEmail csdNormalSite, SiteEmail csdJollySportSite)
    {
        specialSites.Remove(csdNormalSite);
        specialSites.Remove(csdJollySportSite);
    }

    private static void UpdateBccList(List<SiteEmail> sites, SiteEmail specialSite)
    {
        sites.ForEach(site => site.BccList = specialSite.BccList);
    }

    private void AddCCList(List<SiteEmail> sites, SiteEmail csdNormalSite, SiteEmail csdJollySportSite)
    {
        sites.ForEach(site =>
        {
            var ccListForCSD = specialPlatformService.IsSiteJollySportsPlatform(site) ? csdJollySportSite.CcList : csdNormalSite.CcList;
            if (string.IsNullOrWhiteSpace(ccListForCSD))
            {
                return;
            }

            site.CcList = string.IsNullOrWhiteSpace(site.CcList) ? ccListForCSD : $"{site.CcList};{ccListForCSD}";
        });
    }

    public SiteEmail GetSiteByName(IEnumerable<SiteEmail> sites, string name)
    {
        var item = sites.Where(site => site.Site.Equals(name)).ToList();
        return item.Count == 0 ? new SiteEmail() : item[0];
    }
}