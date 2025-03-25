using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetPoolHouseTicketCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    public string? HomeFavorite { get; set; }

    public string? AwayFavorite { get; set; }

    public string? HdpValue { get; set; }

    public string? WrongMarket { get; set; }

    public bool IsLinkGroup1X2 { get; set; }

    public bool IsLinkGroupAIO { get; set; }

    public DateTime? FilterFromTransTime { get; set; }

    public DateTime? FilterToTransTime { get; set; }

    public int LiveIndicator { get; set; }

    public string? WrongOddsInfo { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_PoolHouseTicket_Select");

    public override bool IsValid() => true;
}