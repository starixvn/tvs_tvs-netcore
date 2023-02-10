using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace TicketVoidingSystem.Extensions.TN;

public static class InternalStringExtension
{
    public static string DistinctWithComma(this string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return string.Empty;
        }

        var array = text.Split(',')
            .Distinct()
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .ToArray();
        return string.Join(",", array);
    }

    public static string StripHtml(this string htmlText)
    {
        var reg = new Regex("<[^>]+>", RegexOptions.IgnoreCase);
        var stripped = reg.Replace(htmlText, string.Empty);
        return HttpUtility.HtmlDecode(stripped);
    }
}