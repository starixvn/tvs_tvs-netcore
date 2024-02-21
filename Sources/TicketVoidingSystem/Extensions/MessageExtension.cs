using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.Extensions;

public static class MessageExtension
{
    public static string InsertSpace(this string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return string.Empty;
        }

        const string Pattern = "\\s*@@\\s*";
        const string Replacement = " @@ ";
        var regex = new Regex(Pattern, RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(100));
        var result = regex.Replace(text, Replacement);
        return result.Trim();
    }

    public static XElement CreateItem(this MessageItem messageItem)
    {
        var element = new XElement(
            "Item",
            new XAttribute("MessageId", messageItem.MessageId),
            new XAttribute("TargetId", messageItem.TargetId),
            new XAttribute("TargetName", messageItem.TargetName),
            new XAttribute("BetTransId", messageItem.BetTransId));

        return element;
    }

    public static string CreateTicketsXml(this IEnumerable<TicketEmailModel> emailTickets, bool isAbnormalBet)
    {
        var custInfo = new XElement("root");
        foreach (var ticket in emailTickets)
        {
            var element = ticket.CreateTicketXml(isAbnormalBet);
            custInfo.Add(element);
        }

        return custInfo.ToString();
    }

    private static XElement CreateTicketXml(this TicketEmailModel ticket, bool isAbnormalBet)
    {
        if (isAbnormalBet)
        {
            return new XElement("r",
                new XAttribute("TransId", ticket.TransId),
                new XAttribute("CustId", ticket.CustId),
                new XAttribute("MatchId", ticket.MatchId),
                ticket.WinLostDate == null ? new XAttribute("WinLostDate", string.Empty) : new XAttribute("WinLostDate", ticket.WinLostDate),
                new XAttribute("Status", ticket.Status ?? string.Empty),
                new XAttribute("BetTypeId", ticket.BetTypeId),
                new XAttribute("Stake", ticket.Stake),
                new XAttribute("WinLost", ticket.ZzzWinlost ?? string.Empty),
                new XAttribute("SiteDbGroupId", ticket.SiteDbGroupId));
        }

        return new XElement("r",
            new XAttribute("TransId", ticket.TransId),
            new XAttribute("CustId", ticket.CustId),
            new XAttribute("MatchId", ticket.MatchId));
    }

    public static string CreateDeleteTransactionTicketsXml(this IEnumerable<BetId> betIds)
    {
        var custInfo = new XElement("root");
        foreach (var ticket in betIds)
        {
            var element = new XElement("r",
                new XAttribute("TransId", ticket.TransId),
                new XAttribute("MatchId", ticket.MatchId));
            custInfo.Add(element);
        }

        return custInfo.ToString();
    }
}