namespace SpecialDelete.VoidByBetId.Criteria;

using Fanex.Data.Repository;

public class GetCustomerInfoCriteria : CriteriaBase
{
    public string UserName { get; set; }

    public override string GetSettingKey() => "NAP_CustomerSelInfoByUsername";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(UserName);
}