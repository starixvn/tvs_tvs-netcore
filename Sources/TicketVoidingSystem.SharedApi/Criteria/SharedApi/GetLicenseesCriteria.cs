using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.SharedApi;

public class GetLicenseesCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_Licensees_Select";

    public override bool IsValid() => true;
}