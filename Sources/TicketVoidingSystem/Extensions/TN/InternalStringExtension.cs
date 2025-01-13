using System.Linq;

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
}