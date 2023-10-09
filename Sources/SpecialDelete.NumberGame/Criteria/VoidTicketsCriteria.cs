using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.NumberGame.Criteria;

public class VoidTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public DateTime FromTransDate { get; set; }

    public DateTime ToTransDate { get; set; }

    public string BetTypes { get; set; }

    public string BallSequence { get; set; }

    public bool Option { get; set; }

    public string TransIds { get; set; }

    public string UserName { get; set; }

    public string UserPwd { get; set; }

    public int UserId { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public string Ip { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_BettransDelSpecial_NumberGame");

    public override bool IsValid() => true;
}