using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.VoidSingleBet.Criteria;

public class GetTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public string Bet { get; set; }

    public DateTime? FromTransDate { get; set; }

    public DateTime? ToTransDate { get; set; }

    public int LiveIndicator { get; set; }

    public short? LiveHomeScore { get; set; }

    public short? LiveAwayScore { get; set; }

    public string BetTypes { get; set; }

    public byte SecondAcceptFlag { get; set; }

    public string SettledType { get; set; }

    public byte TimeType { get; set; }

    public string OddsFilter { get; set; }

    public string SelectionSubParlays { get; set; }

    public bool IsCheckTime { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidSingleBet_Select");

    public override bool IsValid() => MatchId > 0;
}