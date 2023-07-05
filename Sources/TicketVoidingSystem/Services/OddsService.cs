using System.Xml;
using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.Services;

public interface OddsService
{
    decimal GetOdds(decimal odds, int betType, int oddsType);

    string GetOddsTypeName(int betType, int oddsType);

    string GetOddsName(string oddsHtml);
}

public class OddsServiceImp : OddsService
{
    private readonly RemotingRefWrapperService remotingRefWrapperService;

    public OddsServiceImp(RemotingRefWrapperService remotingRefWrapperService)
    {
        this.remotingRefWrapperService = remotingRefWrapperService;
    }

    public decimal GetOdds(decimal odds, int betType, int oddsType)
    {
        if (OddsTypeConstant.BetTypeOfDecimalOdds.Contains(betType) && oddsType == OddsTypeConstant.Decimal)
        {
            return odds + 1;
        }

        const int oneHundredPercent = 100;
        return OddsTypeConstant.BetTypeOfDecimalOdds.Contains(betType) && oddsType == OddsTypeConstant.Us ? odds * oneHundredPercent : odds;
    }

    public string GetOddsTypeName(int betType, int oddsType)
    {
        oddsType = GetOddsType(betType, oddsType);
        return remotingRefWrapperService.GetOddsTypeName(oddsType);
    }

    private static int GetOddsType(int betType, int oddsType)
    {
        return OddsTypeConstant.BetTypeOfDecimalOdds.Contains(betType) ? oddsType : 0;
    }

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