using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface OddsInfoValidationService
{
    bool IsValidFavoriteWrongHdp1StHdp(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel);

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

    public bool IsValidFavoriteWrongHdp1StHdp(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return string.IsNullOrWhiteSpace(getLinkedLogModel.HomeFavorite)
            ? IsContainsValue(getLinkedLogModel.AwayFavorite, linkedOddsInfo.Hdp2)
            : IsContainsValue(getLinkedLogModel.HomeFavorite, linkedOddsInfo.Hdp1);
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
            SubIssueTypeConstant.OverUnder => CheckHdpWrongOddsByOuType(linkedOddsInfo, getLinkedLogModel),
            SubIssueTypeConstant.FirstHalfOverUnder => CheckHdpWrongOddsByOuType(linkedOddsInfo, getLinkedLogModel),
            _ => false
        };
    }

    public bool IsValidOddsWrongOdds(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.SubIssueTypeId switch
        {
            SubIssueTypeConstant.Handicap => CheckOddsWrongOddsByBetTeam(linkedOddsInfo, getLinkedLogModel),
            SubIssueTypeConstant.FirstHalfHandicap => CheckOddsWrongOddsByBetTeam(linkedOddsInfo, getLinkedLogModel),
            SubIssueTypeConstant.OverUnder => CheckOddsWrongOddsByOuType(linkedOddsInfo, getLinkedLogModel),
            SubIssueTypeConstant.FirstHalfOverUnder => CheckOddsWrongOddsByOuType(linkedOddsInfo, getLinkedLogModel),
            _ => false
        };
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

    private bool CheckHdpWrongOddsByOuType(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.FilterOuType switch
        {
            FilterTypeWrongOddsConstant.FilterOuTypeHome => IsContainsValue(getLinkedLogModel.OuValue, linkedOddsInfo.Hdp1),
            FilterTypeWrongOddsConstant.FilterOuTypeAway => IsContainsValue(getLinkedLogModel.OuValue, linkedOddsInfo.Hdp2),
            _ => false
        };
    }

    private bool CheckOddsWrongOddsByOuType(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.FilterOuType switch
        {
            FilterTypeWrongOddsConstant.FilterOuTypeHome => CheckOddsWrongOddsByOddsType(getLinkedLogModel, linkedOddsInfo.Odds1a),
            FilterTypeWrongOddsConstant.FilterOuTypeAway => CheckOddsWrongOddsByOddsType(getLinkedLogModel, linkedOddsInfo.Odds2a),
            _ => false
        };
    }

    private bool CheckOddsWrongOddsByBetTeam(LinkedOddsInfo linkedOddsInfo, GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.BetTeam switch
        {
            FilterTypeWrongOddsConstant.BetTeamHome => CheckOddsWrongOddsByOddsType(getLinkedLogModel, linkedOddsInfo.Odds1a),
            FilterTypeWrongOddsConstant.BetTeamAway => CheckOddsWrongOddsByOddsType(getLinkedLogModel, linkedOddsInfo.Odds2a),
            _ => false
        };
    }

    private bool CheckOddsWrongOddsByOddsType(GetLinkedLogModel getLinkedLogModel, decimal? oddsFromApi)
    {
        return getLinkedLogModel.FilterOddsType switch
        {
            FilterTypeWrongOddsConstant.FilterOddsTypeValue => IsContainsValue(getLinkedLogModel.OddsValue, oddsFromApi),
            FilterTypeWrongOddsConstant.FilterOddsTypeRange => decimal.Parse(getLinkedLogModel.FromOdds) <= oddsFromApi
                                                               && decimal.Parse(getLinkedLogModel.ToOdds) >= oddsFromApi,
            _ => false
        };
    }
}