using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

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

        return string.Join(",", result.Distinct());
    }

    public static string GetUnionTransIdString(IEnumerable<string> items, string separator = ",")
    {
        var splitItems = items.Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x.Split(','));

        var transIds = splitItems.SelectMany(x => x).Distinct();
        return string.Join(separator, transIds);
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

    public static string JsonSerializerIgnoreNullValue<T>(T model)
    {
        var options = new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true
        };

        return JsonSerializer.Serialize(model, options);
    }

    public static string JsonSerializerUnsafeRelaxed<T>(T model)
    {
        var options = new JsonSerializerOptions
        {
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };

        return JsonSerializer.Serialize(model, options);
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

        return messageContent.ToLowerInvariant().Contains("kindly double check your statement again")
            ? MessageContentType.VoidSettled
            : MessageContentType.VoidUnsettled;
    }

    public static bool IsAbnormalBet(int issueTypeId)
    {
        return IssueTypeConstant.AbnormalBet == issueTypeId;
    }

    public static bool IsAbnormalAccount(int issueTypeId)
    {
        return IssueTypeConstant.AbnormalAccount == issueTypeId;
    }

    public static string GetBetFrom(string betFrom)
    {
        return betFrom switch
        {
            "p" or "s" or "l" => StringResource.Phone,
            "w" or "m" => StringResource.Wap,
            _ => StringResource.Internet
        };
    }

    public static string SubstringBypassLength(this string source, int startIndex, int maxLength)
    {
        return string.IsNullOrEmpty(source)
            ? source
            : source.Substring(startIndex, Math.Min(source.Length - startIndex, maxLength));
    }
}