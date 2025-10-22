using System;
using System.Collections.Generic;
using System.Text;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Extensions;

public static class ObjectToXmlExtension
{
    /// <summary>
    /// Escapes special characters in XML attribute values
    /// </summary>
    /// <param name="value">The string value to escape</param>
    /// <returns>XML-safe string</returns>
    private static string EscapeXmlAttribute(string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        return value
            .Replace("&", "&amp;")
            .Replace("<", "&lt;")
            .Replace(">", "&gt;")
            .Replace("\"", "&quot;")
            .Replace("'", "&apos;")
            .Replace("$", "&#36;");
    }

    public static string ToTransDateXml(this IEnumerable<TransDateXmlModel> transDateList)
    {
        if (transDateList == null)
        {
            return string.Empty;
        }

        var temp = new StringBuilder();
        foreach (var item in transDateList)
        {
            var from = item.FromTransDate.ZoneCanada();
            var to = item.ToTransDate.ZoneCanada();
            var finalTransDateItem = Environment.NewLine + string.Format(StringResource.TransDateTypeXml, from, to);
            temp.Append(finalTransDateItem.Replace("=\"\"", "=\"All\""));
        }

        return $"<TransDates>{temp}{Environment.NewLine}</TransDates>";
    }

    public static string ToBetTypeXml(this IEnumerable<BetTypeXml> betTypes)
    {
        if (betTypes == null)
        {
            return null;
        }

        var temp = new StringBuilder();
        foreach (var item in betTypes)
        {
            var betType = string.Format(StringResource.BetTypeXml, item.Id,
                EscapeXmlAttribute(item.BetTeam),
                EscapeXmlAttribute(item.Set),
                EscapeXmlAttribute(item.Game),
                EscapeXmlAttribute(item.Value),
                EscapeXmlAttribute(item.ValueHdp1),
                EscapeXmlAttribute(item.ValueHdp2),
                EscapeXmlAttribute(item.Goal),
                EscapeXmlAttribute(item.BetOption),
                EscapeXmlAttribute(item.OddsSpread),
                EscapeXmlAttribute(item.OddsId),
                EscapeXmlAttribute(item.Transdesc),
                EscapeXmlAttribute(item.VirtualHead),
                EscapeXmlAttribute(item.Performance),
                EscapeXmlAttribute(item.PlayerAndOdds));
            temp.Append(betType.Replace("=\"\"", "=\"All\""));
        }

        return $"<BetTypes>{temp}</BetTypes>";
    }
}