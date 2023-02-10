using Fanex.Data.Repository;

namespace TicketVoidingSystem.ABExceptionList.Criteria;

public class GetSitesCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_Site_Select";

    public override bool IsValid() => true;
}