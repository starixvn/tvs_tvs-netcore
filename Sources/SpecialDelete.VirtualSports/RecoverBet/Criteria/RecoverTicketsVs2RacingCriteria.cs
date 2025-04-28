using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.RecoverBet.Criteria;

public class RecoverTicketsVs2RacingCriteria : NonQueryCommand
{
    public int MatchId { get; set; }

    public string TransInfoJson { get; set; }

    public int ErrorCode { get; set; }

    public string ErrorMsg { get; set; }

    public string NegativeBalanceUsers { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_RecoverVSRacing_Update");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransInfoJson);
}