using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class SaveAccountWinLostCommand : NonQueryCommand
{
    public int RequestId { get; set; }

    public string AccountWinLostXml { get; set; }

    public override string GetSettingKey() => "TicketVoiding_AccountWinLost_Update";

    public override bool IsValid() => true;
}