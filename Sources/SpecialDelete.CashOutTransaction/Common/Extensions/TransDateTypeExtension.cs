using System.Text;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace SpecialDelete.CashOutTransaction.Common.Extensions;

public static class TransDateTypeExtension
{
    public static string ToXml(this IEnumerable<TransDateXmlModel> transdateTypes)
    {
        if (transdateTypes == null)
        {
            return string.Empty;
        }

        var temp = new StringBuilder();
        foreach (var item in transdateTypes)
        {
            var from = item.FromTransDate.ZoneCanada();
            var to = item.ToTransDate.ZoneCanada();
            var transdateType = Environment.NewLine + string.Format(StringResource.TransDateTypeXml, from, to);
            temp.Append(transdateType.Replace("=\"\"", "=\"All\""));
        }

        return $"<TransDates>{temp}{Environment.NewLine}</TransDates>";
    }
}