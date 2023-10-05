using System;
using System.Text.Json;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail;

public interface LeagueNameMessageService
{
    void RemoveSabaOfLeagueName(Match match, Message message, SiteEmail site);
}

public class LeagueNameMessageServiceImp : LeagueNameMessageService
{
    public void RemoveSabaOfLeagueName(Match match, Message message, SiteEmail site)
    {
        if (Helper.IsMustRemoveSabaText(match, site))
        {
            var leagueNameReplaced = match.LeagueName.Replace("SABA ", "", StringComparison.InvariantCultureIgnoreCase);
            var leagueNameSimplifiedReplaced = match.LeagueNameSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);

            var serializedContentChineseSimplified = JsonSerializer.Serialize(message.ContentChineseSimplified);
            var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified);
            message.ContentChineseSimplified = deSerializedContentChineseSimplified.Replace(match.LeagueNameSimplified,
                leagueNameSimplifiedReplaced, StringComparison.InvariantCultureIgnoreCase);
            message.ContentEnglish = message.ContentEnglish.Replace(match.LeagueName, leagueNameReplaced, StringComparison.InvariantCultureIgnoreCase);

            match.LeagueName = match.LeagueName.Replace("SABA ", "", StringComparison.InvariantCultureIgnoreCase);
            match.LeagueNameSimplified = match.LeagueNameSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);
            match.LeagueNameNewSimplified = match.LeagueNameNewSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);
        }
    }
}