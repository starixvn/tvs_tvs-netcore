using Fanex.Data.Repository;

namespace TicketVoidingSystem.MarkTickets.Criteria;

public class GetCurrenciesCriteria : CriteriaBase
{
    public override string GetSettingKey() => "NAP_SpecialDelete_VoidByCurrency_SelectAllCurrency";

    public override bool IsValid() => true;
}