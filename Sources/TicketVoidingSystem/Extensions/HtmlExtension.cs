using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using HtmlAgilityPack;
using TicketVoidingSystem.Extensions.TN;

namespace TicketVoidingSystem.Extensions
{
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

            if (html.Contains("originalStake"))
            {
                var originalStake = doc.DocumentNode.SelectNodes("//*[@class='originalStake']").First().InnerText;
                originalStake = originalStake.AppendWithNewLine(stake);

                return GetStakeWithSpecialRemark(originalStake, rebateBonus, nphPromotion);
            }

            if (html.Contains("light-blue"))
            {
                var extend = doc.DocumentNode.SelectNodes("//*[@class='light-blue']").First();
                stake = stake.AppendWithNewLine(extend.InnerText);

                return GetStakeWithSpecialRemark(stake, rebateBonus, nphPromotion);
            }

            if (!string.IsNullOrEmpty(rebateBonus) || !string.IsNullOrEmpty(nphPromotion))
            {
                return GetStakeWithSpecialRemark(stake, rebateBonus, nphPromotion);
            }

            if (html.Contains("return-stake"))
            {
                var returnStake = doc.DocumentNode.SelectNodes("//*[@class='return-stake']").First();
                stake = stake.AppendWithNewLine(returnStake.InnerText);
                var discount = doc.DocumentNode.SelectNodes("//*[@class='discount']").First();
                stake = stake.AppendWithNewLine(discount.InnerText);
                return stake;
            }

            return DefaultText(html);
        }

        private static string GetStakeWithSpecialRemark(string stake, string rebateBonus, string nphPromotion)
        {
            if (!string.IsNullOrEmpty(rebateBonus))
            {
                stake = stake.AppendWithNewLine(rebateBonus);
            }

            if (!string.IsNullOrEmpty(nphPromotion))
            {
                stake = stake.AppendWithNewLine(nphPromotion);
            }

            return stake;
        }

        private static string RebateBonus(this string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);
            if (html.Contains("rebate-bonus"))
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
            if (html.Contains("nph-promotion"))
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
            if (html.Contains("excluding-choices"))
            {
                handicap = node.ChildNodes[0].InnerText + node.ChildNodes[1].InnerText;
                var secondLine = doc.DocumentNode.SelectNodes("//div[@class='excluding-choices']").First().InnerText;
                handicap = handicap.AppendWithNewLine(secondLine);
            }
            else if (html.Contains("Cash Out from No"))
            {
                handicap = node.ChildNodes[0].InnerText;
                var secondLine = node.ChildNodes[1].InnerText + node.ChildNodes[2].InnerText;
                handicap = handicap.AppendWithNewLine(secondLine);
            }
            else
            {
                handicap = node.InnerText;
            }

            return handicap.StripHtml();
        }

        public static string ChoiceSubParlay(this string html, bool isParlay)
        {
            if (string.IsNullOrEmpty(html))
            {
                return string.Empty;
            }

            var doc = new HtmlDocument();
            doc.LoadHtml(html);
            var choice = string.Empty;
            if (isParlay)
            {
                choice = HeaderParlay(doc);
            }

            var handicap = html.Handicap(doc);
            var bettype = doc.DocumentNode.SelectNodes("//div[@class='bettype']").First().InnerHtml.StripHtml();
            var bettypeDescription = GetBettypeDescription(doc);
            if (!string.IsNullOrWhiteSpace(bettypeDescription))
            {
                bettype = bettype.AppendWithNewLine(bettypeDescription);
            }
            var match = doc.DocumentNode.SelectNodes("//div[@class='match']").First();
            var league = doc.DocumentNode.SelectNodes("//div[@class='league']").First();
            return choice.AppendWithNewLine(handicap.StripHtml())
                .AppendWithNewLine(bettype)
                .AppendWithNewLine(match.InnerHtml.StripHtml())
                .AppendWithNewLine(league.InnerHtml.StripHtml()).Replace("\r\n", "\n");
        }

        private static string HeaderParlay(HtmlDocument doc)
        {
            var choice = doc.DocumentNode.SelectNodes("//a").First().InnerHtml.StripHtml();
            var offerName = doc.DocumentNode.SelectNodes("//div[@class='offer-name-list']//div");
            if (offerName != null)
            {
                var offerNameList = offerName.ToArray();
                choice = offerNameList.Aggregate(choice, (current, item) => current.AppendWithNewLine(item.InnerHtml.StripHtml()));
            }

            return choice;
        }

        public static string GetBettypeDescription(HtmlDocument doc)
        {
            var result = string.Empty;
            var descriptionList = doc.DocumentNode.SelectNodes("//div[@class='bettype-description']");
            if (descriptionList != null)
            {
                foreach (var item in descriptionList)
                {
                    result = result.AppendWithNewLine(item.InnerHtml.StripHtml());
                }
            }

            return result;
        }
    }
}