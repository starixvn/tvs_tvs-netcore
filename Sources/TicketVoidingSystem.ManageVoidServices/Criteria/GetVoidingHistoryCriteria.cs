using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageVoidServices.Criteria
{
    public class GetVoidingHistoryCriteria : CriteriaBase
    {
        public int RequestId { get; set; }

        public override string GetSettingKey() => "TicketVoiding_ManageVoidServices_VoidingHistory_Select";

        public override bool IsValid() => true;
    }
}