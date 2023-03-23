using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria
{
    public class GetBalanceUpDayCriteria : CriteriaBase
    {
        public override string GetSettingKey() => "Age_SelBalanceUpDay";

        public override bool IsValid() => true;
    }
}