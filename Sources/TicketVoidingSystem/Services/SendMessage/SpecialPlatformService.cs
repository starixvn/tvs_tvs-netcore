using Fanex.MailDeliver.MailClient;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendMessage;

public interface SpecialPlatformService
{
    void ChangeAppMailIdForSiteJollyPlatform(SiteEmail site);
}

public class SpecialPlatformServiceImp : SpecialPlatformService
{
    private static bool IsSiteJollySportsPlatform(SiteEmail site)
    {
        return site.SpecialPlatform >= SpecialPlatformConstant.JollySports;
    }

    public void ChangeAppMailIdForSiteJollyPlatform(SiteEmail site)
    {
        AppSettings.AppMailId = site == null || !IsSiteJollySportsPlatform(site)
            ? AppSettingService.AppSetting.FanexMailService.AppMailId
            : AppSettingService.AppSetting.FanexMailService.AppMailJollySportsId;
    }
}