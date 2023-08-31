using StackExchange.Redis;
using System.Text.Json;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.Services.SendEmail;

public interface LeagueNameMessageService
{
    void RemoveSaBaOfLeagueName(Match match, Message Message, SiteEmail site);
}

public class LeagueNameMessageServiceImp : LeagueNameMessageService
{
    public void RemoveSaBaOfLeagueName(Match match, Message Message, SiteEmail site)
    {
        if (IsMustRemoveSaBaForLeague(match, site))
        {
            var serializedContentChineseSimplified = JsonSerializer.Serialize(Message.ContentChineseSimplified);
            var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified.Replace("沙巴", ""));

            Message.ContentChineseSimplified = deSerializedContentChineseSimplified;
            Message.ContentEnglish = Message.ContentEnglish.Replace("SABA ", "");
        }
    }

    private static bool IsMustRemoveSaBaForLeague(Match match, SiteEmail site)
    {
        return match?.LeagueGroupId.IsLeagueGroupIdSaBa() == true && (site.IsChinaView || site.SpecialPlatform == SpecialPlatformConstant.JollySports);
    }
}