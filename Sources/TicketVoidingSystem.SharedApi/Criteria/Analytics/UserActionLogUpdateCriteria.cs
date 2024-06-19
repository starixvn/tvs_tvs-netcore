using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.Analytics;

public class UserActionLogUpdateCriteria : NonQueryCommand
{
    public bool IsActionCount { get; set; }

    public int UserId { get; set; }

    public string FunctionName { get; set; }

    public string? LogContent { get; set; }

    public override string GetSettingKey() => "TicketVoiding_UserActionLog_Update";

    public override bool IsValid() => true;
}