using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.Notification;

public class GetNotificationCriteria : NonQueryCommand
{
    public string Username { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Notification_Select";

    public override bool IsValid() => true;
}