namespace SpecialDelete.VirtualSports.Common.Models;

using System;

public class GetTicketModel
{
    public decimal Stake { get; set; }

    public long AwayId { get; set; }

    public long HomeId { get; set; }

    public string BetCheck { get; set; }

    public long BetId { get; set; }

    public string BetTeam { get; set; }

    public int BetType { get; set; }

    public decimal Hdp1 { get; set; }

    public decimal Hdp2 { get; set; }

    public bool IsLiveIndicator { get; set; }

    public int LiveAwayScore { get; set; }

    public int LiveHomeScore { get; set; }

    public decimal Odds { get; set; }

    public decimal MOdds { get; set; }

    public int OddsType { get; set; }

    public long RefNo { get; set; }

    public int SportType { get; set; }

    public string Status { get; set; }

    public DateTime TransDate { get; set; }

    public string TransDesc { get; set; }

    public long TransId { get; set; }

    public int MatchId { get; set; }

    public string UserName { get; set; }

    public string WinLost { get; set; }

    public string GroupName { get; set; }

    public bool IsNeutral { get; set; }

    public string ShowTime { get; set; }

    public long SubTransId { get; set; }

    public string SubBetCheck { get; set; }

    public string SubBetTeam { get; set; }

    public int SubBetType { get; set; }

    public decimal SubHdp1 { get; set; }

    public decimal SubHdp2 { get; set; }

    public decimal SubOdds { get; set; }

    public string SubTransDesc { get; set; }

    public int LeagueId { get; set; }

    public string MatchCode { get; set; }

    public int SiteDbGroupId { get; set; }
}