using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageVoidServices.Criteria;

internal class UpdateLetstalkCriteria : NonQueryCommand
{
    public string BroadcastSessionId { get; set; }

    public int RequestId { get; set; }

    public int StatusId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Letstalk_Update";

    public override bool IsValid() => true;
}