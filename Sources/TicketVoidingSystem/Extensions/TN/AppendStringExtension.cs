using System;
using System.Collections.Generic;
using System.Linq;

namespace TicketVoidingSystem.Extensions.TN
{
    public static class AppendStringExtension
    {
        public static string AppendWithNewLine(this string root, string extend)
        {
            if (string.IsNullOrWhiteSpace(root))
            {
                return extend;
            }
            else if (string.IsNullOrWhiteSpace(extend))
            {
                return root;
            }
            else
            {
                return root + $"{Environment.NewLine}{extend}";
            }
        }

        public static string Intersected(this string textWithComma, List<string> listString)
        {
            if (string.IsNullOrEmpty(textWithComma))
            {
                return string.Empty;
            }

            var users = SplitAndRemoveTab(textWithComma);
            var distinctUsers = listString.Distinct().ToList();
            return GetIntersectedString(users, distinctUsers);
        }

        private static List<string> SplitAndRemoveTab(string value)
        {
            return value.Split(',')
                .Select(x => x.Replace("\t", string.Empty).Trim())
                .ToList();
        }

        private static string GetIntersectedString(List<string> first, List<string> second)
        {
            var intersectedItems = first.Intersect(second, StringComparer.OrdinalIgnoreCase);
            return string.Join(", ", intersectedItems);
        }

        public static string Eliminate(this string root, string elimination)
        {
            if (string.IsNullOrWhiteSpace(root))
            {
                return string.Empty;
            }
            else if (string.IsNullOrWhiteSpace(elimination))
            {
                return root;
            }
            else
            {
                var rootItems = root.Split(',');
                var elinimatedItems = elimination.Split(',');
                var result = from x in rootItems
                             where !elinimatedItems.Contains(x)
                             select x;
                return string.Join(",", result);
            }
        }
    }
}