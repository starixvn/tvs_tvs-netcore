namespace SpecialDelete.NumberGame.Models;

using System;

public class GetTicketModel
{
    public long TransId { get; set; }

    public string UserName { get; set; }

    public decimal Odds { get; set; }

    public int OddsType { get; set; }

    public string Status { get; set; }

    public DateTime TransDate { get; set; }

    public int BetType { get; set; }

    public string BetTeam { get; set; }

    public short LiveHomeScore { get; set; }

    public short LiveAwayScore { get; set; }

    public string Creator { get; set; }

    public decimal Stake { get; set; }

    public decimal Hdp1 { get; set; }

    public decimal Hdp2 { get; set; }

    public string CurrencyName { get; set; }

    public string Site { get; set; }

    public bool IsLiveIndicator { get; set; }

    public string WinLost { get; set; }

    public long BetId { get; set; }

    public long RefNo { get; set; }

    public decimal Comm { get; set; }

    public string MatchCode { get; set; }

    public bool IsNeutral { get; set; }

    public decimal ActualStake { get; set; }

    public int LeagueId { get; set; }

    public string GroupName { get; set; }

    public byte? BallSequence { get; set; }

    public int SportTypeId { get; set; }

    public int SiteDbGroupId { get; set; }
}