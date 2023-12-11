using Fanex.Data;
using Fanex.Data.Repository;
using SpecialDelete.CashOutTransaction.Common.Criteria;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Criteria;

public class VoidTicketsCriteria : CriteriaBase, ExtendSubmittedTicketCriteria
{
    public string TransIds { get; set; }

    public string UserName { get; set; }

    public string UserPassword { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidCashOutTransaction_Update");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}