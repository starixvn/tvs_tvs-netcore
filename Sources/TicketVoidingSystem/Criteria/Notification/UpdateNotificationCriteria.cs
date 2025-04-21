using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.Notification;

public class UpdateNotificationCriteria : CriteriaBase
{
    public string IdList { get; set; }

    public int? RequestId { get; set; }

    public string Username { get; set; }

    public bool? IsRead { get; set; }

    public string Content { get; set; }

    public string Type { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Notification_Update";

    public override bool IsValid() => true;
}