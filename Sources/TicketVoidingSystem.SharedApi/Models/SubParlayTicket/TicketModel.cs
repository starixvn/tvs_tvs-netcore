using System;

namespace TicketVoidingSystem.SharedApi.Models.SubParlayTicket;

public class TicketModel
{
    public long TransId { get; set; }

    public int BetType { get; set; }

    public long HomeId { get; set; }

    public long AwayId { get; set; }

    public decimal Hdp1 { get; set; }

    public decimal Hdp2 { get; set; }

    public decimal Odds { get; set; }

    public string BetTeam { get; set; }

    public byte StatusId { get; set; }

    public string Status { get; set; }

    public DateTime EventDate { get; set; }

    public short LiveHomeScore { get; set; }

    public short LiveAwayScore { get; set; }

    public bool LiveIndicator { get; set; }

    public int LeagueId { get; set; }

    public int SportType { get; set; }

    public bool IsNeutral { get; set; }

    public int MatchId { get; set; }

    public decimal Stake { get; set; }

    public string BetCheck { get; set; }

    public string TransDesc { get; set; }

    public string ShowTime { get; set; }

    public DateTime TransDate { get; set; }
}