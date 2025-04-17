using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class UpdateStatusRequestCommand : NonQueryCommand
{
    public int RequestId { get; set; }

    public bool IsStored { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RequestList_UpdateStatus";

    public override bool IsValid() => true;
}