namespace TicketVoidingSystem.ManageRequest.Models;

public class GetAbnormalBetTicketModel
{
    public long TransId { get; set; }
    public string UserName { get; set; }
    public DateTime TransDate { get; set; }
    public decimal Stake { get; set; }
    public decimal Odds { get; set; }
    public int OddsType { get; set; }
    public decimal OddsSpread { get; set; }
    public short BetType { get; set; }
    public string Status { get; set; }
    public string CurrencyName { get; set; }
    public string BetTeam { get; set; }
    public decimal Hdp1 { get; set; }
    public decimal Hdp2 { get; set; }
    public short LiveHomeScore { get; set; }
    public short LiveAwayScore { get; set; }
    public string BetId { get; set; }
    public string BetCheck { get; set; }
    public bool IsMixParlay { get; set; }
    public int SportType { get; set; }
    public string WinLost { get; set; }
    public bool IsLiveIndicator { get; set; }
    public int? MatchId { get; set; }
    public int HomeId { get; set; }
    public int AwayId { get; set; }
    public int LeagueId { get; set; }
    public bool IsNeutral { get; set; }
    public string MatchCode { get; set; }
    public byte SettlementStatus { get; set; }
    public int? SiteDbGroupId { get; set; }
    public short RemarkId { get; set; }
    public bool IsVipMember { get; set; }
    public decimal ActualStake { get; set; }
    public int? CustomerClass { get; set; }
}