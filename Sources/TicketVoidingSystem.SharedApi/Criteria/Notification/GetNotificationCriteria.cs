using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.Notification;

public class GetNotificationCriteria : NonQueryCommand
{
    public int UserId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Notification_Update";

    public override bool IsValid() => true;
}