using Fanex.Data.Repository;

namespace SpecialDelete.VirtualSports.RecoverBet.Criteria;

public class GetRacingResultCriteria : CriteriaBase
{
    public int EventId { get; set; }

    public override string GetSettingKey() => "NAP_Admin_VS_Betradar_HorseDog_Result_Sel";

    public override bool IsValid() => EventId > 0;
}