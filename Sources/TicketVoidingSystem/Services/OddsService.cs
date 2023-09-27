using System.Xml;

namespace TicketVoidingSystem.Services;

public interface OddsService
{
    string GetOddsName(string oddsHtml);
}

public class OddsServiceImp : OddsService
{
    public string GetOddsName(string oddsHtml)
    {
        const int lengthFoundSpanNodes = 2;
        var xmlDoc = new XmlDocument();
        oddsHtml = "<div>" + oddsHtml + "</div>";
        xmlDoc.LoadXml(oddsHtml);
        var foundSpanNodes = xmlDoc.SelectNodes("//span");

        return foundSpanNodes is { Count: lengthFoundSpanNodes } ? foundSpanNodes[1].InnerText.Trim() : string.Empty;
    }
}