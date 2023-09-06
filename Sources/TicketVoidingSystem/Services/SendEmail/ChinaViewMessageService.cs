using System.Text.Json;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.Services.SendEmail;

public interface ChinaViewMessageService
{
    void ReplaceMessageChinaViewLicensee(Match match, Message Message, SiteEmail site);
}

public class ChinaViewMessageServiceImp : ChinaViewMessageService
{
    public void ReplaceMessageChinaViewLicensee(Match match, Message Message, SiteEmail site)
    {
        if (IsChinaViewAndSaBaLeague(match, site))
        {
            var serializedContentChineseSimplified = JsonSerializer.Serialize(Message.ContentChineseSimplified);
            var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified.Replace("沙巴", ""));

            Message.ContentChineseSimplified = deSerializedContentChineseSimplified;
            Message.ContentEnglish = Message.ContentEnglish.Replace("SABA ", "");
        }
    }

    private static bool IsChinaViewAndSaBaLeague(Match match, SiteEmail site)
    {
        return match?.LeagueGroupId.IsLeagueGroupIdSaBa() == true && site.IsChinaView;
    }
}