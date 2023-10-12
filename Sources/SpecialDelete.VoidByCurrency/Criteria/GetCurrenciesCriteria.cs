using Fanex.Data.Repository;

namespace SpecialDelete.VoidByCurrency.Criteria;

public class GetCurrenciesCriteria : CriteriaBase
{
    public override string GetSettingKey() => "NAP_SpecialDelete_VoidByCurrency_SelectAllCurrency";

    public override bool IsValid() => true;
}