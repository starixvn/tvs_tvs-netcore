using System.Text;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Extensions
{
    public static class ObjectToXMLExtension
    {
        public static string ToResultAmendmentXML(this IEnumerable<ExcelOicModel> tickets)
        {
            var stringBuilder = new StringBuilder();
            foreach (var model in tickets)
            {
                var line = $"<r TransId='{model.TransId}' CustId='{model.CustId}' />";
                stringBuilder.AppendLine(line);
            }

            return $"<root>{stringBuilder.ToString().Trim()}</root>";
        }

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
}