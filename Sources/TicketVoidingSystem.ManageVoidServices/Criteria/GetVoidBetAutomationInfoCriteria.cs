using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageVoidServices.Criteria
{
    public class GetVoidBetAutomationInfoCriteria : CriteriaBase
    {
        public int RequestId { get; set; }

        public int VoidingHistoryId { get; set; }

        public override string GetSettingKey() => "TicketVoiding_VoidBetAutomation_Service_Sel";

        public override bool IsValid() => true;
    }
}