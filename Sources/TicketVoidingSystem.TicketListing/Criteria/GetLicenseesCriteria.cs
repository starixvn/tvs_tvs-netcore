using Fanex.Data.Repository;

namespace TicketVoidingSystem.TicketListing.Criteria;

public class GetLicenseesCriteria : CriteriaBase
{
    public override string GetSettingKey() => "Acc_SiteSel_Licensee";

    public override bool IsValid() => true;
}