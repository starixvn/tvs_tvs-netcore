using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.VoidSingleBet.Criteria;

public class VoidTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public string Bet { get; set; }

    public string BetTypes { get; set; }

    public DateTime? FromTransDate { get; set; }

    public DateTime? ToTransDate { get; set; }

    public byte TimeType { get; set; }

    public string UserName { get; set; }

    public string UserPassword { get; set; }

    public int UserId { get; set; }

    public int LiveIndicator { get; set; }

    public short? LiveHomeScore { get; set; }

    public short? LiveAwayScore { get; set; }

    public byte SecondAcceptFlag { get; set; }

    public string TransIds { get; set; }

    public string Ip { get; set; }

    public string Reason { get; set; }

    public string ReasonSc { get; set; }

    public string OddsFilter { get; set; }

    public string SelectionSubParlays { get; set; }

    public bool IsCheckTime { get; set; }

    public bool IsCalledJackTimeHybridParlay { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidSingleBet_Update");

    public override bool IsValid() => MatchId > 0;
}