using Fanex.Data;
using Fanex.Data.Repository;

namespace SpecialDelete.VirtualSports.RecoverBet.Criteria;

public class GetTicketsVs2RacingCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => "GetTicketsVs2Racing";

    public override bool IsValid() => true;
}