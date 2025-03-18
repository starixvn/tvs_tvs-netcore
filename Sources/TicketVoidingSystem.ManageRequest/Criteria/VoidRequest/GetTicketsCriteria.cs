using Fanex.Data;
using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public int RequestId { get; set; }

    public int IssueTypeId { get; set; }

    public int? RequestDetailId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Void_Select";

    public override bool IsValid() => true;
}