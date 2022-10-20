using System.Collections.Generic;
using System.Text;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

namespace TicketVoidingSystem.MarkTickets.Extensions
{
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
    }
}