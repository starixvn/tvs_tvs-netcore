using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageVoidServices.Criteria;

public class GetVoidServiceDataCriteria : CriteriaBase
{
    public string BroadcastSessionId { get; set; }

    public int? RequestId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_ManageVoidServices_VoidService_Select";

    public override bool IsValid() => true;
}