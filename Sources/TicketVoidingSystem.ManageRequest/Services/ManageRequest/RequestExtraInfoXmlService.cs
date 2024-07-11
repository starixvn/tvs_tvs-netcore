using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface RequestExtraInfoXmlService
{
    public void UpdateRequestDetailProperties(int issueTypeId, IEnumerable<RequestEventModel> models);

    public IEnumerable<OperatorInfo> ParseXmlToOperators(string operatorXml);

    public bool ParseXmlToIsCheckVar(int issueTypeId, string requestExtraInfoXml);
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
            }
        }
    }

    private bool IsIssueTypesHaveExtraInfoJsonFormat(int issueTypeId)
    {
        var issueTypesHasJsonFormat = new[] { IssueTypeConstant.WrongMarketOffered, IssueTypeConstant.TechnicalError };
        return issueTypesHasJsonFormat.Contains(issueTypeId);
    }

    public bool ParseXmlToIsCheckVar(int issueTypeId, string requestExtraInfoXml)
    {
        if (!IsIssueTypesHaveExtraInfoJsonFormat(issueTypeId))
        {
            var root = requestExtraInfoXml.ParseXmlToObject<RequestExtraInfoXml>();
            return root.IsCheckedVar;
        }

        return false;
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