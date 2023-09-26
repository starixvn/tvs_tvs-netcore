using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Extensions;

public static class EmailExtension
{
    public static string ToOperatorsXml(this IEnumerable<int> agentIds)
    {
        if (agentIds == null || !agentIds.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var agentId in agentIds)
        {
            var line = $"<Operator AgentId='{agentId}' />";
            stringBuilder.AppendLine(line);
        }

        return $"<Operators>{stringBuilder.ToString().Trim()}</Operators>";
    }

    public static string GetNegativeBalanceUsers(this IEnumerable<TicketEmailModel> tickets, EmailGroup group, Func<TicketEmailModel, string> filter, string negativeBalanceUsers)
    {
        if (group == EmailGroup.CashOut)
        {
            return string.Empty;
        }

        var usersInSite = tickets.Select(filter).ToList();

        return negativeBalanceUsers.Intersected(usersInSite);
    }

    public static bool Valid(this IEnumerable<TicketEmailModel> tickets, SiteEmail site)
    {
        return tickets.Any() && !string.IsNullOrEmpty(site.ToList);
    }

    public static bool Valid(this IEnumerable<DuplicateTicketsRequestInfo> tickets, SiteEmail site)
    {
        return tickets.Any() && !string.IsNullOrEmpty(site.ToList);
    }

    public static bool Valid<T>(this MailModel<T> model)
    {
        return model.Tickets.Count > 0 && !string.IsNullOrEmpty(model.Site.ToList);
    }

    public static string JoinSites<T>(this IEnumerable<T> items, Func<T, string> filter)
    {
        var sites = items.Select(filter).Distinct().ToArray();
        return string.Join(", ", sites);
    }
}