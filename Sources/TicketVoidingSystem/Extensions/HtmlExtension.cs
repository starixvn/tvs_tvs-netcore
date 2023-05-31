using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using HtmlAgilityPack;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions.TN;

namespace TicketVoidingSystem.Extensions;

public static class HtmlExtension
{
    public static string DefaultText(this string html)
    {
        if (string.IsNullOrEmpty(html))
        {
            return string.Empty;
        }
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc.DocumentNode.InnerText.StripHtml();
    }

    public static string StakeText(this string html)
    {
        if (string.IsNullOrEmpty(html))
        {
            return string.Empty;
        }

        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var stake = doc.DocumentNode.SelectNodes("//*[@class='stake']").First().InnerText;
        var rebateBonus = html.RebateBonus();
        var nphPromotion = html.NPHPromotion();

        if (html.Contains(HtmlClass.OriginalStake)) {
            return GetStakeOriginalStake(doc, rebateBonus, nphPromotion, stake);
        }

        if (html.Contains(HtmlClass.LightBlue)) {
            return GetStakeLightBlue(doc, rebateBonus, nphPromotion, stake);
        }

        if (!string.IsNullOrEmpty(rebateBonus) || !string.IsNullOrEmpty(nphPromotion)) {
            return GetStakeWithSpecialRemark(stake, rebateBonus, nphPromotion);
        }

        if (html.Contains(HtmlClass.ReturnStake)) {
            return GetStakeReturnStake(doc, rebateBonus, nphPromotion, stake);
        }

        return DefaultText(html);
    }

    private static string GetStakeOriginalStake(HtmlDocument doc, string rebateBonus, string nphPromotion, string stake)
    {
        var originalStake = doc.DocumentNode.SelectNodes("//*[@class='originalStake']").First().InnerText;
        originalStake = originalStake.AppendWithNewLine(stake);

        return GetStakeWithSpecialRemark(originalStake, rebateBonus, nphPromotion);
    }

    private static string GetStakeLightBlue(HtmlDocument doc, string rebateBonus, string nphPromotion, string stake)
    {
        var extend = doc.DocumentNode.SelectNodes("//*[@class='light-blue']").First();
        stake = stake.AppendWithNewLine(extend.InnerText);

        return GetStakeWithSpecialRemark(stake, rebateBonus, nphPromotion);
    }

    private static string GetStakeReturnStake(HtmlDocument doc, string rebateBonus, string nphPromotion, string stake)
    {
        var returnStake = doc.DocumentNode.SelectNodes("//*[@class='return-stake']").First();
        stake = stake.AppendWithNewLine(returnStake.InnerText);
        var discount = doc.DocumentNode.SelectNodes("//*[@class='discount']").First();
        stake = stake.AppendWithNewLine(discount.InnerText);
        
        return stake;
    }

    private static string GetStakeWithSpecialRemark(string stake, string rebateBonus, string nphPromotion)
    {
        if (!string.IsNullOrEmpty(rebateBonus))
        {
            return stake.AppendWithNewLine(rebateBonus);
        }

        return (!string.IsNullOrEmpty(nphPromotion)) ? stake.AppendWithNewLine(nphPromotion) : stake;
    }

    private static string RebateBonus(this string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        if (html.Contains(HtmlClass.RebateBonus))
        {
            var extend = doc.DocumentNode.SelectNodes("//*[@class='rebate-bonus']").First();
            return "(" + extend.InnerText + ")";
        }

        return null;
    }

    private static string NPHPromotion(this string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        if (html.Contains(HtmlClass.NphPromotion))
        {
            var extend = doc.DocumentNode.SelectNodes("//*[@class='nph-promotion']").First();
            return "(" + extend.InnerText + ")";
        }

        return null;
    }

    public static string LineBreak(this string html)
    {
        if (string.IsNullOrEmpty(html))
        {
            return string.Empty;
        }

        var temp = html.Replace("<br>", Environment.NewLine);
        return DefaultText(temp);
    }

    private static string StripHtml(this string htmlText)
    {
        var reg = new Regex("<[^>]+>", RegexOptions.IgnoreCase);
        var stripped = reg.Replace(htmlText, string.Empty);
        return HttpUtility.HtmlDecode(stripped);
    }

    public static string Handicap(this string html, HtmlDocument doc)
    {
        if (string.IsNullOrEmpty(html))
        {
            return string.Empty;
        }

        string handicap;
        var node = doc.DocumentNode.SelectNodes("//span").First();

        if (html.Contains(HtmlClass.ExcludingChoices))
        {
            handicap = node.ChildNodes[0].InnerText + node.ChildNodes[1].InnerText;
            var secondLine = doc.DocumentNode.SelectNodes("//div[@class='excluding-choices']").First().InnerText;
            return handicap.AppendWithNewLine(secondLine).StripHtml();
        }

        if (html.Contains(HtmlClass.CashOutFromNo))
        {
            handicap = node.ChildNodes[0].InnerText;
            var secondLine = node.ChildNodes[1].InnerText + node.ChildNodes[2].InnerText;
            return handicap.AppendWithNewLine(secondLine);
        }

        return node.InnerText.StripHtml();
    }

    public static string ChoiceSubParlay(this string html, bool isParlay)
    {
        if (string.IsNullOrEmpty(html))
        {
            return string.Empty;
        }

        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var choice = (isParlay) ? HeaderParlay(doc) : string.Empty;
        var handicap = html.Handicap(doc);
        var bettype = GetBetType(doc);
        var match = doc.DocumentNode.SelectNodes("//div[@class='match']").First();
        var league = doc.DocumentNode.SelectNodes("//div[@class='league']").First();

        return choice.AppendWithNewLine(handicap.StripHtml())
            .AppendWithNewLine(bettype)
            .AppendWithNewLine(match.InnerHtml.StripHtml())
            .AppendWithNewLine(league.InnerHtml.StripHtml()).Replace("\r\n", "\n");
    }

    private static string GetBetType(HtmlDocument doc)
    {
        var bettype = doc.DocumentNode.SelectNodes("//div[@class='bettype']").First().InnerHtml.StripHtml();
        var bettypeDescription = GetBetTypeDescription(doc);
        return (string.IsNullOrWhiteSpace(bettypeDescription)) ? bettype : bettype.AppendWithNewLine(bettypeDescription);
    }

    private static string HeaderParlay(HtmlDocument doc)
    {
        var choice = doc.DocumentNode.SelectNodes("//a").First().InnerHtml.StripHtml();
        var offerName = doc.DocumentNode.SelectNodes("//div[@class='offer-name-list']//div");
        if (offerName == null)
        {
            return choice;
        }

        var offerNameList = offerName.ToArray();
        return offerNameList.Aggregate(choice, (current, item) => current.AppendWithNewLine(item.InnerHtml.StripHtml()));
    }

    public static string ChoiceShortSubParlay(this string html, bool isParlay)
    {
        if (string.IsNullOrEmpty(html))
        {
            return string.Empty;
        }

        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var choice = (isParlay) ? HeaderParlay(doc) : string.Empty;
        var bettypeDescription = GetBetTypeDescription(doc);
        var handicap = html.Handicap(doc);
        return choice.AppendWithNewLine(handicap.StripHtml())
            .AppendWithNewLine(bettypeDescription);
    }

    public static string GetBetTypeDescription(HtmlDocument doc)
    {
        var descriptionList = doc.DocumentNode.SelectNodes("//div[@class='bettype-description']");
        if (descriptionList == null)
        {
            return string.Empty;
        }

        var result = string.Empty;
        foreach (var item in descriptionList)
        {
            result = result.AppendWithNewLine(item.InnerHtml.StripHtml());
        }

        return result;
    }
}