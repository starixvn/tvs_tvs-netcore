using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class InsertVoidingHistoryCriteria : CriteriaBase
{
    public string RequestIds { get; set; }

    public int UserId { get; set; }

    public int SiteDbGroupId { get; set; }

    public string BroadcastSessionId { get; set; }

    public string VoidData { get; set; }

    public override string GetSettingKey() => "TicketVoiding_VoidingHistory_Insert";

    public override bool IsValid() => true;
}