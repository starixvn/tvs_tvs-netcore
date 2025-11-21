namespace SpecialDelete.RecoverParlayBet.Models;

using System;

public class GetMainTicket
{
    public long TransId { get; set; }

    public int MatchId { get; set; }

    public string GroupName { get; set; }

    public string Username { get; set; }

    public DateTime TransDate { get; set; }

    public int BetType { get; set; }

    public long RefNo { get; set; }

    public string Status { get; set; }

    public string WinLost { get; set; }

    public long BetId { get; set; }

    public string BetTeam { get; set; }

    public short LiveAwayScore { get; set; }

    public short LiveHomeScore { get; set; }

    public decimal Stake { get; set; }

    public decimal Odds { get; set; }

    public decimal Hdp2 { get; set; }

    public decimal Hdp1 { get; set; }

    public string BetCheck { get; set; }

    public string TransDesc { get; set; }

    public bool LiveIndicator { get; set; }

    public string BetFrom { get; set; }

    public string ExtraInfo { get; set; }

    public decimal ActualStake { get; set; }

    public int SiteDbGroupId { get; set; }

    public bool IsHybrid { get; set; }

    public decimal OddsSpread { get; set; }

    public long SubTransId { get; set; }
}