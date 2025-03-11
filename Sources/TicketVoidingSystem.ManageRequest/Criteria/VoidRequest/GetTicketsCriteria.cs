using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public int RequestId { get; set; }

    public int IssueTypeId { get; set; }

    public string TransInfoJson { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Void_Select";

    public override bool IsValid() => true;
}