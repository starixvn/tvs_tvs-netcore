using System;
using System.Text.Json;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.Services.SendEmail;

public interface LeagueNameMessageService
{
    bool IsMustRemoveSabaText(Match match, SiteEmail site);

    void RemoveSabaOfLeagueName(Match match, Message message, SiteEmail site);

    string RemoveSabaInChoiceColumn(string choice, Match match, SiteEmail site);
}

public class LeagueNameMessageServiceImp : LeagueNameMessageService
{
    public bool IsMustRemoveSabaText(Match match, SiteEmail site)
    {
        return match != null && match.LeagueGroupId.IsLeagueGroupIdSaBa() && (site.IsChinaView || site.SpecialPlatform == SpecialPlatformConstant.JollySports);
    }

    public void RemoveSabaOfLeagueName(Match match, Message message, SiteEmail site)
    {
        if (IsMustRemoveSabaText(match, site))
        {
            RemoveSabaInMessageContent(match, message);
            RemoveSabaInMatchInfo(match);
        }
    }

    public string RemoveSabaInChoiceColumn(string choice, Match match, SiteEmail site)
    {
        if (IsMustRemoveSabaText(match, site))
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

    private static void RemoveSabaInMessageContent(Match match, Message message)
    {
        var leagueNameReplaced = match.OriginLeagueName.Replace("SABA ", "", StringComparison.InvariantCultureIgnoreCase);
        var leagueNameSimplifiedReplaced = match.OriginLeagueNameSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);

        message.ContentEnglish = message.ContentEnglish.Replace(match.OriginLeagueName, leagueNameReplaced, StringComparison.InvariantCultureIgnoreCase);
        var serializedContentChineseSimplified = JsonSerializer.Serialize(message.ContentChineseSimplified);
        var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified);
        message.ContentChineseSimplified = deSerializedContentChineseSimplified.Replace(match.OriginLeagueNameSimplified, leagueNameSimplifiedReplaced, StringComparison.InvariantCultureIgnoreCase);
    }

    private static void RemoveSabaInMatchInfo(Match match)
    {
        match.LeagueName = match.LeagueName.Replace("SABA ", "", StringComparison.InvariantCultureIgnoreCase);
        match.LeagueNameSimplified = match.LeagueNameSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);
        match.LeagueNameNewSimplified = match.LeagueNameNewSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase);
    }
}