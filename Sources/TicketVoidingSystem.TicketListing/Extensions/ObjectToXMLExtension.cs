using System.Text;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.TicketListing.Extensions;

public static class ObjectToXMLExtension
{
    public static string ToAffectTicketsXml(this IEnumerable<BetId> tickets)
    {
        var stringBuilder = new StringBuilder();
        foreach (var model in tickets)
        {
            var line = $"<r tid='{model.TransId}' />";
            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }
}