using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageVoidServices.Criteria;

public class GetLetstalkCriteria : CriteriaBase
{
    public string BroadcastSessionId { get; set; }

    public int RequestId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_ManageVoidServices_Letstalk_Select";

    public override bool IsValid() => true;
}