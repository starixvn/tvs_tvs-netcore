using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Criteria;

public class GetTicketsVoidCashOutCriteria : CriteriaBase
{
    public int? MatchId { get; set; }

    public string TransIds { get; set; }

    public int? FilterBy { get; set; }

    public string Duration { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidCashOutTransaction_Select");

    public override bool IsValid() => true;
}