using System.Text;
using Fanex.Data.Repository;
using HtmlAgilityPack;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Services.ExportExcel
{
    public interface ConvertBetListForExcelService
    {
        decimal? WinLossHtmlToText(string html);

        string ChoiceHtmlToText(string html, string betId);
    }

    public class ConvertBetListForExcelServiceImp : ConvertBetListForExcelService
    {
        private readonly IDynamicRepository repository;

        public ConvertBetListForExcelServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public decimal? WinLossHtmlToText(string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);
            var winLoss = doc.DocumentNode.InnerText;
            return string.IsNullOrWhiteSpace(winLoss) ? null : Convert.ToDecimal(winLoss);
        }

        public string ChoiceHtmlToText(string html, string betId)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            if (html.Contains("lucky3"))
            {
                return ChoiceLucky3(doc);
            }

            if (html.Contains("combinationLink"))
            {
                return ChoiceSingleMatchParlay(doc, betId);
            }

            var choice = string.Empty;
            if (html.Contains("combo-name"))
            {
                var comboNames = doc.DocumentNode.SelectNodes("//span[@class='combo-name']").ToArray();
                choice = comboNames.Aggregate(choice, (current, item) => current.AppendWithNewLine(item.InnerText));
            }

            if (html.Contains("bettype-description"))
            {
                var betType = BetType(doc, html);
                return choice.AppendWithNewLine(betType).StripHtml();
            }

            var handicap = html.Contains("refund") ?
                doc.DocumentNode.SelectNodes("//div[@class='refund']").First().InnerText :
                doc.DocumentNode.SelectNodes("//div[@class='']").First().InnerText;
            var excludingChoice = handicap.Replace("Excluding", $"{Environment.NewLine}Excluding");

            return choice.AppendWithNewLine(excludingChoice).StripHtml();
        }

        private static string ChoiceLucky3(HtmlDocument doc)
        {
            var numbers = doc.DocumentNode.SelectNodes("//span[@class='lucky3']").First().FirstChild.InnerText;
            var handicap = doc.DocumentNode.SelectNodes("//span[@class='handicap']").First().FirstChild.InnerText;
            var numOfBet = doc.DocumentNode.SelectNodes("//div[@class='num-of-bets']").First().InnerText;
            return numbers
                .AppendWithNewLine(handicap)
                .AppendWithNewLine(numOfBet);
        }

        private string ChoiceSingleMatchParlay(HtmlDocument doc, string betId)
        {
            var betType = doc.DocumentNode.SelectNodes("//div[@class='bettype']").First().InnerText;
            var result = new StringBuilder();
            var criteria = new GetSelectionsSMPCriteria
            {
                TransId = long.Parse(betId)
            };
            var selections = repository.Fetch<SelectionSMP>(criteria).ToList();
            foreach (var item in selections)
            {
                var selection = item.Result.IsRunningOrEmpty() ?
                    item.SelectionName
                    : $"{item.SelectionName} - {item.Result}";
                result.AppendLine(selection);
            }

            return betType.AppendWithNewLine(result.ToString());
        }

        private static string BetType(HtmlDocument doc, string html)
        {
            var choice = html.Handicap(doc);
            var betType = doc.DocumentNode.SelectNodes("//div[@class='bettype']").First().InnerText;
            var bettypeDescription = HtmlExtension.GetBettypeDescription(doc);
            if (!string.IsNullOrWhiteSpace(bettypeDescription))
            {
                betType = betType.AppendWithNewLine(bettypeDescription);
            }

            return choice.AppendWithNewLine(betType);
        }
    }
}