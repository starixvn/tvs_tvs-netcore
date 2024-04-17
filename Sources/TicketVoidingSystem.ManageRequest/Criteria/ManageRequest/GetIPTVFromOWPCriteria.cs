using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetIPTVFromOWPCriteria : CriteriaBase
{
    public string MatchInfoJson { get; set; }

    public override string GetSettingKey() => "OWP";

    public override bool IsValid() => true;
}