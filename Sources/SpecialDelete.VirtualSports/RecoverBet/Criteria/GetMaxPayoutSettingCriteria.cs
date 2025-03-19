using Fanex.Data.Repository;

namespace SpecialDelete.VirtualSports.RecoverBet.Criteria;

public class GetMaxPayoutSettingCriteria : CriteriaBase
{
    public string ListCust { get; set; }

    public override string GetSettingKey() => "NAP_Admin_Settlement_MaxPayoutSetting_Sel";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(ListCust);
}