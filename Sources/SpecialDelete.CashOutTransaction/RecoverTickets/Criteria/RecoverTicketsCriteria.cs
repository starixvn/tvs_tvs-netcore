using Fanex.Data;
using Fanex.Data.Repository;
using SpecialDelete.CashOutTransaction.Common.Criteria;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Criteria;

public class RecoverTicketsCriteria : CriteriaBase, ExtendSubmittedTicketCriteria
{
    public string TransIds { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_RecoverCashOutTransaction_Update");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}