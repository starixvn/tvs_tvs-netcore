using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.RecoverBet.Criteria;

public class RecoverTicketsVs2RacingCriteria : NonQueryCommand
{
    public string TransInfoJson { get; set; }

    public int ErrorCode { get; set; }

    public string ErrorMsg { get; set; }

    public string NegativeBalanceUsers { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_RecoverVS2_Update");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransInfoJson);
}