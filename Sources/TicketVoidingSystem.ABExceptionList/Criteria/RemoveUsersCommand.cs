using Fanex.Data.Repository;

namespace TicketVoidingSystem.ABExceptionList.Criteria;

public class RemoveUsersCommand : NonQueryCommand
{
    public string CustIds { get; set; }

    public int UserId { get; set; }
    public string IP { get; set; }

    public override string GetSettingKey() => "TicketVoiding_ABWhiteList_Update";

    public override bool IsValid() => true;
}