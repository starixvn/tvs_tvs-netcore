using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria
{
    public class GetSportsTypeCriteria : CriteriaBase
    {
        public override string GetSettingKey() => "TicketVoiding_SportsType_Select";

        public override bool IsValid() => true;
    }
}