using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface RequestExtraInfoXmlService
{
    public void UpdateRequestDetailProperties(int issueTypeId, IEnumerable<RequestEventModel> models);

    public IEnumerable<OperatorInfo> ParseXmlToOperators(string operatorXml);

    public void UpdateRequestInfoForCopy(int issueTypeId, RequestInfoForCopy requestInfoForCopy);
}

public class RequestExtraInfoXmlServiceImp : RequestExtraInfoXmlService
{
    public void UpdateRequestDetailProperties(int issueTypeId, IEnumerable<RequestEventModel> models)
    {
        if (!IsIssueTypesHaveExtraInfoJsonFormat(issueTypeId))
        {
            foreach (var model in models)
            {
                var root = model.RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
                model.AATime = string.IsNullOrWhiteSpace(root.AATime) ? null : int.Parse(root.AATime);
                model.PATime = string.IsNullOrWhiteSpace(root.PATime) ? null : int.Parse(root.PATime);
                model.SATime = string.IsNullOrWhiteSpace(root.SATime) ? null : int.Parse(root.SATime);
                model.ScoreId = string.IsNullOrWhiteSpace(root.ScoreId) ? 0 : int.Parse(root.ScoreId);

                model.IsMainMatch = root.IsMainMatch;
                model.HomeFavorite = root.HomeFavorite;
                model.AwayFavorite = root.AwayFavorite;
                model.ActualMarket = root.ActualMarket;
                model.WrongMarket = root.WrongMarket;
                model.HdpValue = root.HdpValue;
                model.IsCheckedVar = root.IsCheckedVar;
                model.PoolHouseCheckedBetTypes = root.PoolHouseCheckedBetTypes;
                model.IsLinkGroup1X2 = root.IsLinkGroup1X2;
                model.IsLinkGroupAIO = root.IsLinkGroupAIO;
                model.LiveIndicator = root.LiveIndicator;
                model.BetTypeIds = root.BetTypeIds;
                model.WicketOver = root.WicketOver;
                model.PlayerIds = root.PlayerIds;
                model.Runs = root.Runs;
                model.Live = root.Live;
                model.NonLive = root.NonLive;
                model.PlayerId = root.PlayerId;
                model.FilterFavoriteType = root.FilterFavoriteType;
                model.FavoriteValue = root.FavoriteValue;
                model.WrongOU = root.WrongOU;
                model.Spread = root.Spread;
                model.AllowanceRate = root.AllowanceRate;
                model.CorrectOddsHomeOver = root.CorrectOddsHomeOver;
                model.CorrectOddsAwayUnder = root.CorrectOddsAwayUnder;
                model.FromOddsNotVoidHomeOver = root.FromOddsNotVoidHomeOver;
                model.ToOddsNotVoidHomeOver = root.ToOddsNotVoidHomeOver;
                model.FromOddsNotVoidAwayUnder = root.FromOddsNotVoidAwayUnder;
                model.ToOddsNotVoidAwayUnder = root.ToOddsNotVoidAwayUnder;

                model.FilterOddsType = root.FilterOddsType;
                model.OddsValue = root.OddsValue;
                model.FromOdds = root.FromOdds;
                model.ToOdds = root.ToOdds;
                model.CorrectOdds = root.CorrectOdds;

                model.CurrencyIds = root.CurrencyIds;
                model.LicenseeNames = root.LicenseeNames;
                model.WrongName = root.WrongName;
                model.ActualName = root.ActualName;
                model.WrongNameT = root.WrongNameT;
                model.ActualNameT = root.ActualNameT;
                model.WrongNameS = root.WrongNameS;
                model.ActualNameS = root.ActualNameS;
            }
        }
    }

    private bool IsIssueTypesHaveExtraInfoJsonFormat(int issueTypeId)
    {
        var issueTypesHasJsonFormat = new[] { IssueTypeConstant.WrongMarketOffered, IssueTypeConstant.TechnicalError };
        return issueTypesHasJsonFormat.Contains(issueTypeId);
    }

    public void UpdateRequestInfoForCopy(int issueTypeId, RequestInfoForCopy requestInfoForCopy)
    {
        if (!IsIssueTypesHaveExtraInfoJsonFormat(issueTypeId))
        {
            var root = requestInfoForCopy.RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            requestInfoForCopy.IsCheckedVar = root.IsCheckedVar;
            requestInfoForCopy.FilterOddsType = root.FilterOddsType;
            requestInfoForCopy.OddsValue = root.OddsValue;
            requestInfoForCopy.FromOdds = root.FromOdds;
            requestInfoForCopy.ToOdds = root.ToOdds;
            requestInfoForCopy.CorrectOdds = root.CorrectOdds;
        }
    }

    public IEnumerable<OperatorInfo> ParseXmlToOperators(string operatorXml)
    {
        var root = operatorXml.ParseXmlToObject<RootOperatorsXml>();
        var operators = root.OperatorXmls;
        var result = operators.Count > 0 ? operators.Select(x =>
            new OperatorInfo { OperatorId = x.OperatorId, OperatorType = x.TypeId }
        ).ToList() : new List<OperatorInfo>();

        return result;
    }
}