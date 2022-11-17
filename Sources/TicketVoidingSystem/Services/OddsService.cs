using System.Xml;
using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.Services
{
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

            return OddsTypeConstant.BetTypeOfDecimalOdds.Contains(betType) && oddsType == OddsTypeConstant.Us ? odds * 100 : odds;
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
            var valueNode = string.Empty;
            var xmlDoc = new XmlDocument();
            oddsHtml = "<div>" + oddsHtml + "</div>";
            xmlDoc.LoadXml(oddsHtml);
            var foundSpanNodes = xmlDoc.SelectNodes("//span");

            if (foundSpanNodes != null && foundSpanNodes.Count == 2)
            {
                valueNode = foundSpanNodes[1].InnerText.Trim();
            }

            return valueNode;
        }
    }
}