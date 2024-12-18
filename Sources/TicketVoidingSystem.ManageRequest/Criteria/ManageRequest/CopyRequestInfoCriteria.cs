using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class CopyRequestInfoCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    public int MatchId { get; set; }

    public int? RequestDetailId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RequestInfo_Copy";

    public override bool IsValid() => true;
}