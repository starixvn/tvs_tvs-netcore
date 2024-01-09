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

    public static bool Valid(this IEnumerable<TicketEmailModel> tickets, SiteEmail site)
    {
        return tickets.Any() && !string.IsNullOrEmpty(site.ToList);
    }

    public static bool Valid(this IEnumerable<DuplicateTicketsRequestInfo> tickets, SiteEmail site)
    {
        return tickets.Any() && !string.IsNullOrEmpty(site.ToList);
    }

    public static bool Valid<T>(this IEnumerable<T> tickets, SiteEmail site)
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

    public static string GetNegativeBalanceUsers<T, U>(
        this MailRecoverModel<T, U> model, EmailGroup group, Func<U, string> filter)
    {
        return GetNegativeBalanceUsers(model, group, filter, model.ViewModel);
    }

    private static string GetNegativeBalanceUsers<U>
        (MailModel<U> model, EmailGroup group, Func<U, string> filter, MailViewModel viewModel)
    {
        if (group == EmailGroup.CashOut)
        {
            return string.Empty;
        }

        var usersInSite = model.Tickets.Select(filter).ToList();
        var negativeBalanceUsers = viewModel.NegativeBalanceUsers;
        return negativeBalanceUsers.Intersected(usersInSite);
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

    public static string GetNegativeBalanceUsers<T>(this IEnumerable<T> tickets, EmailGroup group, Func<T, string> filter, string negativeBalanceUsers)
    {
        if (group == EmailGroup.CashOut)
        {
            return string.Empty;
        }

        var usersInSite = tickets.Select(filter).ToList();

        return negativeBalanceUsers.Intersected(usersInSite);
    }
}