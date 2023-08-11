using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetRelatedMatchCriteria : CriteriaBase
{
    public int MatchId { get; set; }
    public DateTime? EventDate { get; set; }
    public bool IsMainMatch { get; set; }
    public int IssueTypeId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RelatedEvent_Select";

    public override bool IsValid() => MatchId > 0;
}