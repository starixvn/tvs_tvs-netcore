using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;

public class GetTicketsCriteria : CriteriaBase
{
    public byte Status { get; set; }

    public byte SearchBy { get; set; }

    public int MatchId { get; set; }

    public string Duration { get; set; }

    public short? LiveIndicator { get; set; }

    public short? LiveHomeScore { get; set; }

    public short? LiveAwayScore { get; set; }

    public string CurrencyIDs { get; set; }

    public string LicenseeNames { get; set; }

    public string BetTypes { get; set; }

    public string Bet { get; set; }

    public string TransIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "Nap_SpecialDelete_MarkTickets_Select");

    public override bool IsValid() => true;
}