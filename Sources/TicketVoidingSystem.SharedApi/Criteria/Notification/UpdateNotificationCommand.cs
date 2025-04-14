using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.Notification;

public class UpdateNotificationCommand : NonQueryCommand
{
    public int UserId { get; set; }
    public int Id { get; set; }
    public bool IsRead { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Notification_Update";

    public override bool IsValid() => true;
}