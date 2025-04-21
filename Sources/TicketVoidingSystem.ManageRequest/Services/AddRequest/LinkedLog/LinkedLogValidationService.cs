using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface LinkedLogValidationService
{
    bool IsAffectedLinkTime(DateTime time, GetLinkedLogModel getLinkedLogModel);

    bool IsLinkGroupFullTime(int linkGroup);

    bool IsLinkGroupHalfTime(int linkGroup);

    bool IsLinkGroupWrongOdds(int linkGroup, int subIssueType);

    bool IsAffectedLinkedOddsForWrongHdp(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel);

    bool IsAffectedLinkedOddsForWrong1stHdp(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel);

    bool IsAffectedLinkedOddsForWrongOU(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel);

    bool IsAffectedLinkedOddsForWrong1stOU(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel);

    bool IsAffectedLinkedOddsForWrongOdds(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel);

    bool IsNotAffectedLinkTime(DateTime time, DateTime filterFromTransTime);

    bool IsAnyLinkedOddsByBetType(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, int betType);

    bool IsAnyLinkedOddsByBetTypeForWrongOdds(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel);
}

public class LinkedLogValidationServiceImp : LinkedLogValidationService
{
    private static bool IsContainsValue(string? parent, decimal? child)
    {
        return !string.IsNullOrWhiteSpace(parent) && parent.Split('&').Select(x => (decimal?)decimal.Parse(x)).Contains(child);
    }

    public bool IsAffectedLinkTime(DateTime time, GetLinkedLogModel getLinkedLogModel)
    {
        return time >= getLinkedLogModel.FilterFromTransTime && time <= getLinkedLogModel.FilterToTransTime;
    }

    public bool IsLinkGroupFullTime(int linkGroup)
    {
        return linkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1X2;
    }

    public bool IsLinkGroupHalfTime(int linkGroup)
    {
        return linkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1H1X2;
    }

    public bool IsLinkGroupWrongOdds(int linkGroup, int subIssueType)
    {
        return subIssueType switch
        {
            SubIssueTypeConstant.Handicap => IsLinkGroupFullTime(linkGroup),
            SubIssueTypeConstant.OverUnder => IsLinkGroupFullTime(linkGroup),
            SubIssueTypeConstant.FirstHalfHandicap => IsLinkGroupHalfTime(linkGroup),
            SubIssueTypeConstant.FirstHalfOverUnder => IsLinkGroupHalfTime(linkGroup),
            _ => false
        };
    }

    public bool IsAffectedLinkedOddsForWrongHdp(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel)
    {
        return linkedOddsInfoDic.Values
             .Any(y => y.BetType == BetTypeConstant.Handicap && CheckLinkedOddsForWrongHdp1stHdpBySubIssueType(y, getLinkedLogModel));
    }

    public bool IsAffectedLinkedOddsForWrong1stHdp(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel)
    {
        return linkedOddsInfoDic.Values
            .Any(y => y.BetType == BetTypeConstant.FirstHalfHandicap && CheckLinkedOddsForWrongHdp1stHdpBySubIssueType(y, getLinkedLogModel));
    }

    internal virtual bool CheckLinkedOddsForWrongHdp1stHdpBySubIssueType(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.SubIssueTypeId switch
        {
            SubIssueTypeConstant.WrongHDP or SubIssueTypeConstant.Wrong1stHDP =>
                string.IsNullOrWhiteSpace(getLinkedLogModel.HomeFavorite)
                    ? IsContainsValue(getLinkedLogModel.AwayFavorite, linkedOddsInfo.Hdp2)
                    : IsContainsValue(getLinkedLogModel.HomeFavorite, linkedOddsInfo.Hdp1),
            SubIssueTypeConstant.WrongHDPHomeVirtualHeadReversed
                or SubIssueTypeConstant.Wrong1stHDPHomeVirtualHeadReversed => IsContainsValue(
                    getLinkedLogModel.HdpValue, linkedOddsInfo.Hdp1),
            SubIssueTypeConstant.WrongHDPAwayVirtualHeadReversed
                or SubIssueTypeConstant.Wrong1stHDPAwayVirtualHeadReversed => IsContainsValue(
                    getLinkedLogModel.HdpValue, linkedOddsInfo.Hdp2),
            _ => false
        };
    }

    public bool IsAffectedLinkedOddsForWrongOU(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel)
    {
        return linkedOddsInfoDic.Values
            .Any(y => y.BetType == BetTypeConstant.OverUnder && IsContainsValue(getLinkedLogModel.WrongMarket, y.Hdp1));
    }

    public bool IsAffectedLinkedOddsForWrong1stOU(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel)
    {
        return linkedOddsInfoDic.Values
            .Any(y => y.BetType == BetTypeConstant.FirstHalfOverUnder && IsContainsValue(getLinkedLogModel.WrongMarket, y.Hdp1));
    }

    public bool IsAffectedLinkedOddsForWrongOdds(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel)
    {
        return linkedOddsInfoDic.Values
            .Any(y => IsValidBetTypeWrongOdds(y.BetType, getLinkedLogModel)
                      && IsValidHdpWrongOdds(y, getLinkedLogModel)
                      && IsValidOddsWrongOdds(y, getLinkedLogModel));
    }

    public bool IsNotAffectedLinkTime(DateTime time, DateTime filterFromTransTime)
    {
        return time < filterFromTransTime;
    }

    public bool IsAnyLinkedOddsByBetType(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, int betType)
    {
        return linkedOddsInfoDic.Values.Any(y => y.BetType == betType);
    }

    public bool IsAnyLinkedOddsByBetTypeForWrongOdds(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDic, GetLinkedLogModel getLinkedLogModel)
    {
        return linkedOddsInfoDic.Values.Any(y => IsValidBetTypeWrongOdds(y.BetType, getLinkedLogModel));
    }

    internal static bool IsValidBetTypeWrongOdds(int betType, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.SubIssueTypeId switch
        {
            SubIssueTypeConstant.Handicap => betType == BetTypeConstant.Handicap,
            SubIssueTypeConstant.FirstHalfHandicap => betType == BetTypeConstant.FirstHalfHandicap,
            SubIssueTypeConstant.OverUnder => betType == BetTypeConstant.OverUnder,
            SubIssueTypeConstant.FirstHalfOverUnder => betType == BetTypeConstant.FirstHalfOverUnder,
            _ => false
        };
    }

    internal static bool IsValidHdpWrongOdds(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.SubIssueTypeId switch
        {
            SubIssueTypeConstant.Handicap => CheckHdpWrongOddsByFavoriteType(linkedOddsInfo, getLinkedLogModel),
            SubIssueTypeConstant.FirstHalfHandicap => CheckHdpWrongOddsByFavoriteType(linkedOddsInfo, getLinkedLogModel),
            SubIssueTypeConstant.OverUnder => CheckHdpWrongOddsByWrongOu(linkedOddsInfo, getLinkedLogModel),
            SubIssueTypeConstant.FirstHalfOverUnder => CheckHdpWrongOddsByWrongOu(linkedOddsInfo, getLinkedLogModel),
            _ => false
        };
    }

    internal static bool IsValidOddsWrongOdds(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return decimal.Parse(getLinkedLogModel.FromOddsNotVoidHomeOver) > linkedOddsInfo.Odds1a || decimal.Parse(getLinkedLogModel.ToOddsNotVoidHomeOver) < linkedOddsInfo.Odds2a
            || decimal.Parse(getLinkedLogModel.FromOddsNotVoidAwayUnder) > linkedOddsInfo.Odds1a || decimal.Parse(getLinkedLogModel.ToOddsNotVoidAwayUnder) < linkedOddsInfo.Odds2a;
    }

    internal static bool CheckHdpWrongOddsByFavoriteType(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.FilterFavoriteType switch
        {
            FilterTypeWrongOddsConstant.BetTeamHome => decimal.Parse(getLinkedLogModel.FavoriteValue) == linkedOddsInfo.Hdp1,
            FilterTypeWrongOddsConstant.BetTeamAway => decimal.Parse(getLinkedLogModel.FavoriteValue) == linkedOddsInfo.Hdp2,
            _ => false
        };
    }

    internal static bool CheckHdpWrongOddsByWrongOu(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return decimal.Parse(getLinkedLogModel.WrongOU) == linkedOddsInfo.Odds1a;
    }
}