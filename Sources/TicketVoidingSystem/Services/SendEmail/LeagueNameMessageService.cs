using System.Text.Json;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail;

public interface LeagueNameMessageService
{
    void RemoveSabaOfLeagueName(Match match, Message Message, SiteEmail site);
}

public class LeagueNameMessageServiceImp : LeagueNameMessageService
{
    public void RemoveSabaOfLeagueName(Match match, Message Message, SiteEmail site)
    {
        if (Helper.IsMustRemoveSabaText(match, site))
        {
            var serializedContentChineseSimplified = JsonSerializer.Serialize(Message.ContentChineseSimplified);
            var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified.Replace("沙巴", ""));

            Message.ContentChineseSimplified = deSerializedContentChineseSimplified;
            Message.ContentEnglish = Message.ContentEnglish.Replace("SABA ", "");
        }
    }
}