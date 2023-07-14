using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetProviderCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public override string GetSettingKey() => "OWP_TVSSupport_GetProviderByMatchId";

    public override bool IsValid() => true;
}