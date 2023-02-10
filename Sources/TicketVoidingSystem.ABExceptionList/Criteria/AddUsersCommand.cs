using Fanex.Data.Repository;

namespace TicketVoidingSystem.ABExceptionList.Criteria;

public class AddUsersCommand : NonQueryCommand
{
    public string Usernames { get; set; }
    public int UserId { get; set; }
    public string SubTypes { get; set; }
    public bool VoidVIP { get; set; }

    public string IP { get; set; }

    public override string GetSettingKey() => "TicketVoiding_ABWhiteList_Insert";

    public override bool IsValid() => true;
}