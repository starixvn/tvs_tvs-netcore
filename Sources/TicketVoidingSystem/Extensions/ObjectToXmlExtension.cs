using System;
using System.Collections.Generic;
using System.Text;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Extensions;

public static class ObjectToXmlExtension
{
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
            var betType = Environment.NewLine + string.Format(StringResource.BetTypeXml,
                item.Id, item.BetTeam, item.Set, item.Game, item.Value, item.ValueHdp1, item.ValueHdp2, item.Goal, item.BetOption, item.OddsSpread, item.OddsId, item.Transdesc, item.VirtualHead);
            temp.Append(betType.Replace("=\"\"", "=\"All\""));
        }

        return $"<BetTypes>{temp}{Environment.NewLine}</BetTypes>";
    }
}