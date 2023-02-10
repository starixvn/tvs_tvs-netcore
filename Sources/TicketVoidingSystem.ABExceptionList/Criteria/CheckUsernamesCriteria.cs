using Fanex.Data.Repository;

namespace TicketVoidingSystem.ABExceptionList.Criteria;

public class CheckUsernamesCriteria : CriteriaBase
{
    public string Usernames { get; set; }

    public override string GetSettingKey() => "TicketVoiding_ABWhiteList_CheckUserName";

    public override bool IsValid() => true;
}