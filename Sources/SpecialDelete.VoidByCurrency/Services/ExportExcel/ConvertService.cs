using Fizzler.Systems.HtmlAgilityPack;
using HtmlAgilityPack;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Extensions.TN;

namespace SpecialDelete.VoidByCurrency.Services.ExportExcel;

public interface ConvertService
{
    string Choice(string html);
}

public class ConvertServiceImp : ConvertService
{
    public string Choice(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var choice = string.Empty;
        if (html.Contains("combinationLink"))
        {
            choice = HeaderParlay(doc);
        }
        var betType = BetType(doc, html);

        return betType.Contains("Single Match Parlay") ? choice : choice.AppendWithNewLine(betType).StripHtml();
    }

    private static string HeaderParlay(HtmlDocument doc)
    {
        var choice = doc.DocumentNode.QuerySelector("a").InnerText;
        var combinations = doc.DocumentNode.QuerySelectorAll(".offer-name-list div");
        return combinations.Aggregate(choice, (current, item) => current.AppendWithNewLine(item.InnerText));
    }

    private static string BetType(HtmlDocument doc, string html)
    {
        var choice = html.Handicap(doc);
        var betType = doc.DocumentNode.SelectNodes("//div[@class='bettype']").First().InnerText;
        var bettypeDescription = HtmlExtension.GetBetTypeDescription(doc);
        if (!string.IsNullOrWhiteSpace(bettypeDescription))
        {
            betType = betType.AppendWithNewLine(bettypeDescription);
        }

        return choice.AppendWithNewLine(betType);
    }
}