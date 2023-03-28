using Fanex.Data.Repository;

namespace TicketVoidingSystem.TicketListing.Criteria;

public class GetSelectionTypesCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public override string GetSettingKey() => "NAP_SelectionTypeSel";

    public override bool IsValid() => true;
}