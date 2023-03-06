using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageVoidServices.Criteria;

internal class GetLetstalkCriteria : CriteriaBase
{
    public string BroadcastSessionId { get; set; }

    public int RequestId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_ManageVoidServices_Letstalk_Select";

    public override bool IsValid() => true;
}