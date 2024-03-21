using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Fanex.MailDeliver.MailClient;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.Services.SendMessage;

public interface SpecialPlatformService
{
    bool IsSiteSpecialPlatform(Match? match, SiteEmail site);

    bool IsTicketSpecialPlatform(TicketEmailModel ticket);

    (IEnumerable<TicketEmailModel> NormalTickets, IEnumerable<TicketEmailModel> SpecialPlatformTickets) GroupTicketSaba(IEnumerable<TicketEmailModel> tickets);

    Message RemoveSabaInMessageContent(Match match, Message message);

    Match RemoveSabaInMatchInfo(Match match);

    string GetCurrencyNameOfSpecialPlatformTicket(TicketEmailModel ticket);

    string GetDepartmentNameForEmailVoidDuplicated(SiteEmail site);

    string GetContactAddressForEmailVoidDuplicated(SiteEmail site);

    void ChangeAppMailIdForSiteJollyPlatform(SiteEmail site);

    bool IsSiteJollySportsPlatform(SiteEmail site);

    string GetTitleForMailRecord(SiteEmail site);
}

public class SpecialPlatformServiceImp : SpecialPlatformService
{
    private const string SabaReplaceText = "SABA ";

    public bool IsSiteSpecialPlatform(Match? match, SiteEmail site)
    {
        return match != null && match.LeagueGroupId.IsLeagueGroupIdSaBa() && (site.IsChinaView || site.SpecialPlatform >= SpecialPlatformConstant.JollySports);
    }

    public bool IsTicketSpecialPlatform(TicketEmailModel ticket)
    {
        return ticket.LeagueGroupId.IsLeagueGroupIdSaBa() && (ticket.IsChinaView || ticket.SpecialPlatform >= SpecialPlatformConstant.JollySports);
    }

    public (IEnumerable<TicketEmailModel> NormalTickets, IEnumerable<TicketEmailModel> SpecialPlatformTickets) GroupTicketSaba(IEnumerable<TicketEmailModel> tickets)
    {
        var specialPlatformTickets = tickets.Where(IsTicketSpecialPlatform);
        var normalTickets = tickets.Except(specialPlatformTickets);

        return (normalTickets, specialPlatformTickets);
    }

    public Message RemoveSabaInMessageContent(Match? match, Message message)
    {
        if (match == null)
        {
            return message;
        }

        var outputMessage = message.DeepClone();
        var leagueNameReplaced = match.OriginLeagueName.Replace(SabaReplaceText, "", StringComparison.InvariantCultureIgnoreCase);

        var leagueNameSimplifiedReplaced = match.OriginLeagueNameSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase)
            .Replace(SabaReplaceText, "", StringComparison.InvariantCultureIgnoreCase);
        outputMessage.ContentEnglish = outputMessage.ContentEnglish.Replace(match.OriginLeagueName, leagueNameReplaced, StringComparison.InvariantCultureIgnoreCase);
        var serializedContentChineseSimplified = JsonSerializer.Serialize(outputMessage.ContentChineseSimplified);
        var deSerializedContentChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentChineseSimplified);
        outputMessage.ContentChineseSimplified = deSerializedContentChineseSimplified.Replace(match.OriginLeagueNameSimplified,
            leagueNameSimplifiedReplaced, StringComparison.InvariantCultureIgnoreCase);

        var leagueNameTraditionalReplaced = match.OriginLeagueNameTraditional.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase)
            .Replace(SabaReplaceText, "", StringComparison.InvariantCultureIgnoreCase);
        var serializedContentChineseTraditional = JsonSerializer.Serialize(outputMessage.ContentChineseTraditional);
        var deSerializedContentChineseTraditional = JsonSerializer.Deserialize<string>(serializedContentChineseTraditional);
        outputMessage.ContentChineseTraditional = deSerializedContentChineseTraditional.Replace(match.OriginLeagueNameTraditional,
            leagueNameTraditionalReplaced, StringComparison.InvariantCultureIgnoreCase);

        var leagueNameNewSimplifiedReplaced = match.OriginLeagueNameNewSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase)
            .Replace(SabaReplaceText, "", StringComparison.InvariantCultureIgnoreCase);
        var serializedContentNewChineseSimplified = JsonSerializer.Serialize(outputMessage.ContentNewChineseSimplified);
        var deSerializedContentNewChineseSimplified = JsonSerializer.Deserialize<string>(serializedContentNewChineseSimplified);
        outputMessage.ContentNewChineseSimplified = deSerializedContentNewChineseSimplified.Replace(match.OriginLeagueNameNewSimplified,
            leagueNameNewSimplifiedReplaced, StringComparison.InvariantCultureIgnoreCase);

        return outputMessage;
    }

    public Match RemoveSabaInMatchInfo(Match match)
    {
        match.LeagueName = match.LeagueName.Replace(SabaReplaceText, "", StringComparison.InvariantCultureIgnoreCase);
        match.LeagueNameSimplified = match.LeagueNameSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase)
            .Replace(SabaReplaceText, "", StringComparison.InvariantCultureIgnoreCase);
        match.LeagueNameNewSimplified = match.LeagueNameNewSimplified.Replace("沙巴", "", StringComparison.InvariantCultureIgnoreCase)
            .Replace(SabaReplaceText, "", StringComparison.InvariantCultureIgnoreCase);
        return match;
    }

    public string GetCurrencyNameOfSpecialPlatformTicket(TicketEmailModel ticket)
    {
        if (ticket.SpecialPlatform != SpecialPlatformConstant.JollySports && ticket.SpecialPlatform != SpecialPlatformConstant.JollySportsCv)
        {
            return ticket.CurrencyName;
        }
        return ticket.CurrencyName.Equals(CurrencyConstant.Pe4, StringComparison.InvariantCultureIgnoreCase) ? CurrencyConstant.Mp : ticket.CurrencyName;
    }

    public bool IsSiteJollySportsPlatform(SiteEmail site)
    {
        if (site == null)
        {
            return false;
        }

        return site.SpecialPlatform >= SpecialPlatformConstant.JollySports;
    }

    public string GetDepartmentNameForEmailVoidDuplicated(SiteEmail site)
    {
        return "Customer Service Team";
    }

    public string GetContactAddressForEmailVoidDuplicated(SiteEmail site)
    {
        return IsSiteJollySportsPlatform(site) ? "cs@jollysports.com" : "cs@oneonone-solutions.com";
    }

    public void ChangeAppMailIdForSiteJollyPlatform(SiteEmail site)
    {
        AppSettings.AppMailId = IsSiteJollySportsPlatform(site)
            ? AppSettingService.AppSetting.FanexMailService.AppMailJollySportsId
            : AppSettingService.AppSetting.FanexMailService.AppMailId;
    }

    public string GetTitleForMailRecord(SiteEmail site)
    {
        return IsSiteJollySportsPlatform(site) ? "JollySports Notice / 通知" : "沙巴体育通知 | Saba Sports Notice";
    }
}