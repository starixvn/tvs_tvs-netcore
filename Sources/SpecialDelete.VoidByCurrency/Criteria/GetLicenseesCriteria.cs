using Fanex.Data.Repository;

namespace SpecialDelete.VoidByCurrency.Criteria;

public class GetLicenseesCriteria : CriteriaBase
{
    public override string GetSettingKey() => "NAP_SpecialDelete_VoidByCurrency_SelectLicensees";

    public override bool IsValid() => true;
}