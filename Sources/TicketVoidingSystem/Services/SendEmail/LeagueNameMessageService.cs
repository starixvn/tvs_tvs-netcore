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
    string RemoveSabaInChoiceColumn(string choice, Match match, SiteEmail site);
}

public class LeagueNameMessageServiceImp : LeagueNameMessageService
{
    public void RemoveSabaOfLeagueName(Match match, Message message, SiteEmail site)
    {
        if (Helper.IsMustRemoveSabaText(match, site))
        {
            ReplaceMessageArea(match, message);
            ReplaceLeagueMatchInfo(match);
        }
    }

    public string RemoveSabaInChoiceColumn(string choice, Match match, SiteEmail site)
    {
        if (Helper.IsMustRemoveSabaText(match, site))
        {
            var leagueNameReplaced = match.OriginLeagueName.Replace("SABA ", "", StringComparison.InvariantCultureIgnoreCase);
            var leagueNameSimplifiedReplaced = match.OriginLeagueNameSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);
            var serializedChoice = JsonSerializer.Serialize(choice);
            return JsonSerializer.Deserialize<string>(serializedChoice)
                .Replace(match.OriginLeagueNameSimplified, leagueNameSimplifiedReplaced, StringComparison.InvariantCultureIgnoreCase)
                .Replace(match.OriginLeagueName, leagueNameReplaced, StringComparison.InvariantCultureIgnoreCase);
        }

        return choice;
    }

    private static void ReplaceMessageArea(Match match, Message message)
    {
        var leagueNameReplaced = match.OriginLeagueName.Replace("SABA ", "", StringComparison.InvariantCultureIgnoreCase);
        var leagueNameSimplifiedReplaced = match.OriginLeagueNameSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);

        message.ContentEnglish = message.ContentEnglish.Replace(match.OriginLeagueName, leagueNameReplaced, StringComparison.InvariantCultureIgnoreCase);
        var serializedContentChineseSimplified = JsonSerializer.Serialize(message.ContentChineseSimplified);
        var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified);
        message.ContentChineseSimplified = deSerializedContentChineseSimplified.Replace(match.OriginLeagueNameSimplified, leagueNameSimplifiedReplaced, StringComparison.InvariantCultureIgnoreCase);
    }

    private static void ReplaceLeagueMatchInfo(Match match)
    {
        match.LeagueName = match.LeagueName.Replace("SABA ", "", StringComparison.InvariantCultureIgnoreCase);
        match.LeagueNameSimplified = match.LeagueNameSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);
        match.LeagueNameNewSimplified = match.LeagueNameNewSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);
    }
}