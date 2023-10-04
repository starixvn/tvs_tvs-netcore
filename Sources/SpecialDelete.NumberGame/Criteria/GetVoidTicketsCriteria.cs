using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.NumberGame.Criteria;

public class GetVoidTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public DateTime FromTransDate { get; set; }

    public DateTime ToTransDate { get; set; }

    public string BetTypes { get; set; }

    public string BallSequence { get; set; }

    public bool Option { get; set; }

    public string TransIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_BettransSelSpecialDel_NumberGame");

    public override bool IsValid() => true;
}