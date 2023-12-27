using Fanex.MailDeliver.MailClient;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendMessage;

public interface SpecialPlatformService
{
    string GetDepartmentNameForEmailVoidDuplicated(SiteEmail site);

    string GetContactAddressForEmailVoidDuplicated(SiteEmail site);

    void ChangeAppMailIdForSiteJollyPlatform(SiteEmail site);

    bool IsSiteJollySportsPlatform(SiteEmail site);
}

public class SpecialPlatformServiceImp : SpecialPlatformService
{
    public bool IsSiteJollySportsPlatform(SiteEmail site)
    {
        return site.SpecialPlatform >= SpecialPlatformConstant.JollySports;
    }

    public string GetDepartmentNameForEmailVoidDuplicated(SiteEmail site)
    {
        return IsSiteJollySportsPlatform(site) ? "CS JOLLY SPORTS" : "CS ONEONONE.SOLUTIONS";
    }

    public string GetContactAddressForEmailVoidDuplicated(SiteEmail site)
    {
        return IsSiteJollySportsPlatform(site) ? "cs@jollysports.com" : "cs@oneonone-solutions.com";
    }

    public void ChangeAppMailIdForSiteJollyPlatform(SiteEmail site)
    {
        AppSettings.AppMailId = site == null || !IsSiteJollySportsPlatform(site)
            ? AppSettingService.AppSetting.FanexMailService.AppMailId
            : AppSettingService.AppSetting.FanexMailService.AppMailJollySportsId;
    }
}