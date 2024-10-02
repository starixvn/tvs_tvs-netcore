using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.SharedApi;

public class GetCurrenciesCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_Currency_Select";

    public override bool IsValid() => true;
}