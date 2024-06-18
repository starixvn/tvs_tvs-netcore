using System.Text;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace SpecialDelete.CashOutTransaction.Common.Extensions;

public static class TransDateTypeExtension
{
    public static string ToXml(this IEnumerable<TransDateXmlModel>? transDateTypes)
    {
        if (transDateTypes == null)
        {
            return string.Empty;
        }

        var temp = new StringBuilder();
        foreach (var item in transDateTypes)
        {
            var from = item.FromTransDate.ZoneCanada();
            var to = item.ToTransDate.ZoneCanada();
            var transDateType = Environment.NewLine + string.Format(StringResource.TransDateTypeXml, from, to);
            temp.Append(transDateType.Replace("=\"\"", "=\"All\""));
        }

        return $"<TransDates>{temp}{Environment.NewLine}</TransDates>";
    }
}