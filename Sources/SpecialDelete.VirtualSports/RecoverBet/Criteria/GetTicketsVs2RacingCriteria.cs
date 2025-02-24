using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.RecoverBet.Criteria;

public class GetTicketsVs2RacingCriteria : CriteriaBase
{
    public string Resources { get; set; }

    public string TransIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_RecoverSportsRacing_Sel");

    public override bool IsValid() => true;
}