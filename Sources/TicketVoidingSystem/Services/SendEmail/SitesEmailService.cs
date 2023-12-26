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
        return sites.Where(s => !Array.Exists(testSiteNames, t => t.Equals(s.Site, StringComparison.CurrentCultureIgnoreCase)))
            .ToList();
    }

    private void HandleEmailConfiguration(List<SiteEmail> sites)
    {
        var jsonPath = AppSettingService.AppSetting.FanexMailService.MailingList;
        var specialSites = Helper.DeserializeJsonFileToObject<List<SiteEmail>>(jsonPath);
        var (specialSite, specialJollySportsSite) = GetSpecialSites(specialSites);
        UpdateBccList(sites, specialSite);
        AddCCList(sites, specialSite, specialJollySportsSite);
        RemoveSpecialSites(specialSites, specialSite, specialJollySportsSite);
        sites.AddRange(specialSites);
    }

    private static (SiteEmail, SiteEmail) GetSpecialSites(List<SiteEmail> specialSites)
    {
        const int specialSiteId = 9_999_999; //9999999
        const int specialJollySportsSiteId = 9_000_000; //9000000
        var specialSite = specialSites.Single(x => x.SiteId == specialSiteId);
        var specialJollySportsSite = specialSites.Single(x => x.SiteId == specialJollySportsSiteId);
        return (specialSite, specialJollySportsSite);
    }

    private static void RemoveSpecialSites(List<SiteEmail> specialSites, SiteEmail specialSite, SiteEmail specialJollySportsSite)
    {
        specialSites.Remove(specialSite);
        specialSites.Remove(specialJollySportsSite);
    }

    private static void UpdateBccList(List<SiteEmail> sites, SiteEmail specialSite)
    {
        sites.ForEach(site => site.BccList = specialSite.BccList);
    }

    private void AddCCList(List<SiteEmail> sites, SiteEmail specialSite, SiteEmail specialJollySportsSite)
    {
        sites.ForEach(site =>
        {
            var ccListSpecialSite = specialPlatformService.IsSiteJollySportsPlatform(site) ? specialJollySportsSite.CcList : specialSite.CcList;
            if (ccListSpecialSite == null)
            {
                return;
            }

            site.CcList = string.IsNullOrWhiteSpace(site.CcList) ? ccListSpecialSite : $"{site.CcList};{ccListSpecialSite}";
        });
    }

    public SiteEmail GetSiteByName(IEnumerable<SiteEmail> sites, string name)
    {
        var item = sites.Where(site => site.Site.Equals(name)).ToList();
        return item.Count == 0 ? new SiteEmail() : item[0];
    }
}