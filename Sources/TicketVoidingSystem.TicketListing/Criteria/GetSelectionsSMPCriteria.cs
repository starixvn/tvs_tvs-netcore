using Fanex.Data.Repository;

namespace TicketVoidingSystem.TicketListing.Criteria;

public class GetSelectionsSMPCriteria : CriteriaBase
{
    public long TransId { get; set; }

    public override string GetSettingKey() => "NAP_SpecialDelete_SMP_Selections_Select";

    public override bool IsValid() => true;
}