using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetTicketsCriteria : OnlineServerCriteriaBase
{
    public int MatchId { get; set; }

    public int RequestId { get; set; }

    public int IssueTypeId { get; set; }

    public int? RequestDetailId { get; set; }

    public string OnlineServerIds { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_Void_Select");

    public override bool IsValid() => true;
}