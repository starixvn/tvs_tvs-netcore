using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Utilities
{
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
            if (!items.Any())
            {
                return string.Empty;
            }

            var splitItems = items.Select(x =>
                string.IsNullOrWhiteSpace(x) ? string.Empty.Split(',').ToList() : x.Split(',').ToList());

            var result = Enumerable.Empty<string>();
            foreach (var transIdList in splitItems)
            {
                result = result.Union(transIdList);
            }

            return string.Join(",", result);
        }

        public static string JoinBetIdList(IEnumerable<BetId> items)
        {
            return string.Join(",", items.Select(x => x.TransId));
        }

        public static string GetFilePath(string path)
        {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
        }
    }
}