using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface OddsInfoValidationService
{
    bool IsValidInputHdpForWrongHdp1StHdp(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel);

    bool IsContainsValue(string parent, decimal? child);

    bool IsValidLinkGroupWrongOdds(PoolHouseLinkedLogResponse linkedLog, GetLinkedLogModel getLinkedLogModel);

    bool IsValidBetTypeWrongOdds(int betType, GetLinkedLogModel getLinkedLogModel);

    bool IsValidHdpWrongOdds(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel);

    bool IsValidOddsWrongOdds(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel);
}

public class OddsInfoValidationServiceImp : OddsInfoValidationService
{
    private const int GroupId1X2 = 1;
    private const int GroupIdAio = 2;
    private const int GroupId1H1X2 = 3;

    public bool IsValidInputHdpForWrongHdp1StHdp(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        switch (getLinkedLogModel.SubIssueTypeId)
        {
            case SubIssueTypeConstant.WrongHDP:
            case SubIssueTypeConstant.Wrong1stHDP:
                {
                    return string.IsNullOrWhiteSpace(getLinkedLogModel.HomeFavorite)
                        ? IsContainsValue(getLinkedLogModel.AwayFavorite, linkedOddsInfo.Hdp2)
                        : IsContainsValue(getLinkedLogModel.HomeFavorite, linkedOddsInfo.Hdp1);
                }
            case SubIssueTypeConstant.WrongHDPHomeVirtualHeadReversed:
            case SubIssueTypeConstant.Wrong1stHDPHomeVirtualHeadReversed:
                return IsContainsValue(getLinkedLogModel.HdpValue, linkedOddsInfo.Hdp1);

            case SubIssueTypeConstant.WrongHDPAwayVirtualHeadReversed:
            case SubIssueTypeConstant.Wrong1stHDPAwayVirtualHeadReversed:
                return IsContainsValue(getLinkedLogModel.HdpValue, linkedOddsInfo.Hdp2);

            default:
                return true;
        }
    }

    public bool IsContainsValue(string? parent, decimal? child)
    {
        return !string.IsNullOrWhiteSpace(parent) && parent.Split('&').Select(x => (decimal?)decimal.Parse(x)).Contains(child);
    }

    public bool IsValidBetTypeWrongOdds(int betType, GetLinkedLogModel getLinkedLogModel)
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

    public bool IsValidLinkGroupWrongOdds(PoolHouseLinkedLogResponse linkedLog, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.SubIssueTypeId switch
        {
            SubIssueTypeConstant.Handicap => linkedLog.LinkGroup is GroupIdAio or GroupId1X2,
            SubIssueTypeConstant.OverUnder => linkedLog.LinkGroup is GroupIdAio or GroupId1X2,
            SubIssueTypeConstant.FirstHalfHandicap => linkedLog.LinkGroup is GroupIdAio or GroupId1H1X2,
            SubIssueTypeConstant.FirstHalfOverUnder => linkedLog.LinkGroup is GroupIdAio or GroupId1H1X2,
            _ => false
        };
    }

    public bool IsValidHdpWrongOdds(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
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

    public bool IsValidOddsWrongOdds(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return CheckWrongOddsByRangeOdds(getLinkedLogModel, linkedOddsInfo.Odds1a) || CheckWrongOddsByRangeOdds(getLinkedLogModel, linkedOddsInfo.Odds2a);
    }

    private bool CheckHdpWrongOddsByFavoriteType(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.FilterFavoriteType switch
        {
            FilterTypeWrongOddsConstant.FilterFavoriteTypeHome => IsContainsValue(getLinkedLogModel.FavoriteValue, linkedOddsInfo.Hdp1),
            FilterTypeWrongOddsConstant.FilterFavoriteTypeAway => IsContainsValue(getLinkedLogModel.FavoriteValue, linkedOddsInfo.Hdp2),
            _ => false
        };
    }

    private bool CheckHdpWrongOddsByWrongOu(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return IsContainsValue(getLinkedLogModel.WrongOU, linkedOddsInfo.Hdp1);
    }

    private static bool CheckWrongOddsByRangeOdds(GetLinkedLogModel getLinkedLogModel, decimal? oddsFromApi)
    {
        return decimal.Parse(getLinkedLogModel.FromOddsNotVoidHomeOver) > oddsFromApi || decimal.Parse(getLinkedLogModel.ToOddsNotVoidHomeOver) < oddsFromApi
            || decimal.Parse(getLinkedLogModel.FromOddsNotVoidAwayUnder) > oddsFromApi || decimal.Parse(getLinkedLogModel.ToOddsNotVoidAwayUnder) < oddsFromApi;
    }
}