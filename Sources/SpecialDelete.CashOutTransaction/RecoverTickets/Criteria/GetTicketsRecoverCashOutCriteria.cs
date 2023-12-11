using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Criteria;

public class GetTicketsRecoverCashOutCriteria : CriteriaBase
{
    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public string TransIds { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_RecoverCashOutTransaction_Select");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}