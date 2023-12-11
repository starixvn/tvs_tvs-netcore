using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Fanex.NAP.Client.Models;
using Force.DeepCloner;
using Microsoft.AspNetCore.Http;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.Utilities;

public static class Helper
{
    public static string GetSettingKeyBySiteDbGroupId(int siteDbGroupId, string spName)
    {
        var serverName = SiteDbGroupConstant.ServerList.First(x => x.Id == siteDbGroupId).ServerName;

        return $"{serverName}.{spName}";
    }

    public static string GetIntersectTransIdString(IEnumerable<string> items)
    {
        if (!items.Any())
        {
            return string.Empty;
        }

        var convertItems = items.Select(x =>
            string.IsNullOrWhiteSpace(x) ? string.Empty.Split(',').ToList() : x.Split(',').ToList());
        var result = convertItems.First();
        for (var i = 1; i < convertItems.Count(); i++)
        {
            result = result.Intersect(convertItems.ElementAt(i)).ToList();
        }

        return string.Join(",", result);
    }

    public static string GetUnionTransIdString(IEnumerable<string> items)
    {
        var splitItems = items.Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x.Split(','));

        var transIds = splitItems.SelectMany(x => x).Distinct();
        return string.Join(",", transIds);
    }

    public static string JoinBetIdList(IEnumerable<BetId> items)
    {
        return string.Join(",", items.Select(x => x.TransId));
    }

    public static string GetFilePath(string path)
    {
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
    }

    public static T DeserializeJsonFileToObject<T>(string jsonPath)
    {
        var path = GetFilePath(jsonPath);
        var jsonString = File.ReadAllText(path);
        var options = new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true
        };
        return JsonSerializer.Deserialize<T>(jsonString, options);
    }

    public static T DeserializeObjectIgnoreNullValue<T>(string input)
    {
        var options = new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true
        };

        return JsonSerializer.Deserialize<T>(input, options);
    }

    public static StringContent CreateRequestStringContent<T>(T data)
    {
        var dataJson = new StringContent(
            JsonSerializer.Serialize(data, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }),
            Encoding.UTF8,
            MediaTypeNames.Application.Json);

        return dataJson;
    }

    public static async Task<T> DeserializeResponseStream<T>(HttpResponseMessage response)
    {
        await using var responseStream = await response.Content.ReadAsStreamAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        return await JsonSerializer.DeserializeAsync<T>(responseStream, options);
    }

    public static string MessageFailApiCricket(IEnumerable<BetId> transIdCrickets, string actionType)
    {
        var transIds = string.Join(", ", transIdCrickets.Select(x => x.TransId));
        var result = actionType == NetPositionConstant.ActionVoid ?
            string.Format(StringResource.FailAPIVoidCricket, transIds) :
            string.Format(StringResource.FailAPIRecoverCricket, transIds);

        return result;
    }

    public static int GetMessageContentType(bool isLikelyAbnormalBet, string messageContent)
    {
        if (isLikelyAbnormalBet)
        {
            return MessageContentType.VoidAbnormal;
        }

        return messageContent.ToLowerInvariant().Contains("kindly double check your statement again") ? MessageContentType.VoidSettled : MessageContentType.VoidUnsettled;
    }

    public static bool IsLikelyAbnormalBet(int issueTypeId)
    {
        return IsAbnormalBet(issueTypeId) || IsAbnormalBetRealMember(issueTypeId);
    }

    private static bool IsAbnormalBet(int issueTypeId)
    {
        return IssueTypeConstant.AbnormalBet == issueTypeId;
    }

    public static bool IsAbnormalBetSingleRequest(int issueTypeId, int? filterBy)
    {
        return IsAbnormalBet(issueTypeId) && filterBy == null;
    }

    public static bool IsAbnormalAccount(int issueTypeId)
    {
        return IssueTypeConstant.AbnormalAccount == issueTypeId;
    }

    public static bool IsAbnormalBetRealMember(int issueTypeId)
    {
        return IssueTypeConstant.AbnormalBetRealMember == issueTypeId;
    }

    public static string GetBetFrom(string betFrom)
    {
        string result;
        switch (betFrom)
        {
            case "p":
            case "s":
            case "l":
                result = StringResource.Phone;
                break;

            case "w":
            case "m":
                result = StringResource.Wap;
                break;

            default:
                result = StringResource.Internet;
                break;
        }

        return result;
    }

    public static bool IsMustRemoveSabaText(Match match, SiteEmail site)
    {
        return match != null && match.LeagueGroupId.IsLeagueGroupIdSaBa() && (site.IsChinaView || site.SpecialPlatform == SpecialPlatformConstant.JollySports);
    }

    public static IEnumerable<MenuItem> UpdateNapMenuItem(IEnumerable<MenuItem> menuItemList, IHttpContextAccessor httpContextAccessor)
    {
        var menuItemsClone = menuItemList.DeepClone();
        foreach (var item in menuItemsClone)
        {
            item.Url = GetMenuPath(item, httpContextAccessor);
        }

        return menuItemsClone;
    }

    private static string GetMenuPath(MenuItem menu, IHttpContextAccessor httpContextAccessor)
    {
        if (string.IsNullOrWhiteSpace(menu.Url))
        {
            return string.Empty;
        }

        if (IsMenuOfNewPage(menu))
        {
            return $"{httpContextAccessor.HttpContext.Request.PathBase}{menu.Url}";
        }

        if (AppSettingService.AppSetting.OldSiteRootUrl.StartsWith('/'))
        {
            var oldSiteAbsolutePath = $"https://{httpContextAccessor.HttpContext.Request.Host}{AppSettingService.AppSetting.OldSiteRootUrl}";
            return $"{oldSiteAbsolutePath}{menu.Url[1..]}";
        }

        return $"{AppSettingService.AppSetting.OldSiteRootUrl}{menu.Url[1..]}";
    }

#pragma warning disable S1541 // Methods and properties should not be too complex

    private static bool IsMenuOfNewPage(MenuItem menu)
#pragma warning restore S1541 // Methods and properties should not be too complex
    {
        string[] listNames = {"AB Exception List" , "Mark/Unmark Tickets" , "Ticket Listing" , "Void Single Bet" , "Manage Request" , "Add Request"
            , "Upload Batch Message" , "Void Parlay Sub Bet" , "Recover Virtual Sports Bet" , "Recover By Bet ID" , "Void Number Game Bet", "Void By Currency"
            , "Void By Bet ID", "Cancel Cash Out Action", "Recover Cash Out Transaction"};
        return listNames.Contains(menu.Name);
    }
}