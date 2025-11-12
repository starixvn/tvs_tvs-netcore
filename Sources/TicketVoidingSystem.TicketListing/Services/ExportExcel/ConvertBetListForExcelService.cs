using System.Text;
using Fanex.Data.Repository;
using HtmlAgilityPack;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.TicketListing.Constants;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.ViewModels;

namespace TicketVoidingSystem.TicketListing.Services.ExportExcel;

public interface ConvertBetListForExcelService
{
    decimal? WinLossHtmlToText(string html);

    string ChoiceHtmlToText(string html, string betId);

    string BetIdToText(TicketViewModel ticket);
}

public class ConvertBetListForExcelServiceImp(IDynamicRepository repository) : ConvertBetListForExcelService
{
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

        var choice = GetChoiceComboName(doc, html);
        return html switch
        {
            _ when html.Contains(HtmlClass.Lucky3) => GetChoiceLucky3(doc),
            _ when html.Contains(HtmlClass.CombinationLink) => GetChoiceSingleMatchParlay(doc, betId),
            _ when html.Contains(HtmlClass.BetTypeDescription) => GetChoiceBetTypeDescription(doc, html, choice),
            _ => GetChoiceRefund(doc, html, choice)
        };
    }

    public string BetIdToText(TicketViewModel ticket)
    {
        return ticket.BetId != ticket.SubTransId && ticket.IsHybrid ?
         $"{ticket.BetId}\nSubId:\n{ticket.SubTransId}" : ticket.BetId.ToString();
    }

    private static string GetChoiceRefund(HtmlDocument doc, string html, string choice)
    {
        var handicap = html.Contains(HtmlClass.Refund) ?
            doc.DocumentNode.SelectNodes("//div[@class='refund']")[0].InnerText :
            doc.DocumentNode.SelectNodes("//div[@class='']")[0].InnerText;
        var excludingChoice = handicap.Replace("Excluding", $"{Environment.NewLine}Excluding");
        return choice.AppendWithNewLine(excludingChoice).StripHtml();
    }

    private static string GetChoiceComboName(HtmlDocument doc, string html)
    {
        if (!html.Contains(HtmlClass.ComboName))
        {
            return string.Empty;
        }

        var choice = string.Empty;
        var comboNames = doc.DocumentNode.SelectNodes("//span[@class='combo-name']").ToArray();
        return comboNames.Aggregate(choice, (current, item) => current.AppendWithNewLine(item.InnerText));
    }

    private static string GetChoiceBetTypeDescription(HtmlDocument doc, string html, string choice)
    {
        var betType = GetBetType(doc, html);
        return choice.AppendWithNewLine(betType).StripHtml();
    }

    private static string GetChoiceLucky3(HtmlDocument doc)
    {
        var numbers = doc.DocumentNode.SelectNodes("//span[@class='lucky3']")[0].FirstChild.InnerText;
        var handicap = doc.DocumentNode.SelectNodes("//span[@class='handicap']")[0].FirstChild.InnerText;
        var numOfBet = doc.DocumentNode.SelectNodes("//div[@class='num-of-bets']")[0].InnerText;
        return numbers
            .AppendWithNewLine(handicap)
            .AppendWithNewLine(numOfBet);
    }

    private string GetChoiceSingleMatchParlay(HtmlDocument doc, string betId)
    {
        var result = new StringBuilder();
        var betType = doc.DocumentNode.SelectNodes("//div[@class='bettype']")[0].InnerText;
        var selections = CreateSelectionsSMP(betId);

        foreach (var item in selections)
        {
            var selection = item.Result.IsRunningOrEmpty() ?
                item.SelectionName
                : $"{item.SelectionName} - {item.Result}";
            result.AppendLine(selection);
        }

        return betType.AppendWithNewLine(result.ToString());
    }

    private IEnumerable<SelectionSMP> CreateSelectionsSMP(string betId)
    {
        var criteria = new GetSelectionsSMPCriteria
        {
            TransId = long.Parse(betId)
        };

        return repository.Fetch<SelectionSMP>(criteria).ToList();
    }

    private static string GetBetType(HtmlDocument doc, string html)
    {
        var choice = html.Handicap(doc);
        var betType = doc.DocumentNode.SelectNodes("//div[@class='bettype']")[0].InnerText;
        var betTypeDescription = HtmlExtension.GetBetTypeDescription(doc);
        betType = !string.IsNullOrWhiteSpace(betTypeDescription) ? betType.AppendWithNewLine(betTypeDescription) : betType;

        return choice.AppendWithNewLine(betType);
    }
}