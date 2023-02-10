using System.Collections.Generic;
using System.Linq;
using System.Text;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

namespace TicketVoidingSystem.MarkTickets.Extensions;

public static class ObjectToXmlExtensions
{
    public static string ToMarkedMatchXml(this IEnumerable<MarkedMatchXmlModel> markedMatches)
    {
        if (markedMatches == null)
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var item in markedMatches)
        {
            var line =
                $"<Match MatchId='{item.MatchId}' UserId='{item.UserId}' CreatedDate='{item.CreatedDate.ToString(FormatKey.SqlDateTimeFormat)}' />";
            stringBuilder.AppendLine(line);
        }

        return $"<Matches>{stringBuilder.ToString().Trim()}</Matches>";
    }

    public static string ToTransIdsXml(this IEnumerable<string> transIds)
    {
        if (transIds == null)
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var transId in transIds)
        {
            var line = $"<Ticket Id='{transId}'/>";
            stringBuilder.AppendLine(line);
        }

        return $"<Tickets>{stringBuilder.ToString().Trim()}</Tickets>";
    }

    public static string ToTransInfoXml(this IEnumerable<TransInfoAutoUnmarkModel> transInfo)
    {
        if (transInfo == null || !transInfo.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var item in transInfo)
        {
            var line = $"<r mid='{item.MatchId}' t='{item.TransId}' btype='{item.Bettype}' us='{item.UserId}' " +
                       $"crdate='{item.CreatedDate.ToString(FormatKey.SqlDateTimeFormat)}' mt='{item.MarkType}' bid='{item.BetId}'/>";
            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }
}