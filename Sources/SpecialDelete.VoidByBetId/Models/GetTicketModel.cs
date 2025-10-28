namespace SpecialDelete.VoidByBetId.Models;

public class GetTicketModel
{
    public int BetType { get; set; }
    public long TransId { get; set; }
    public long BetId { get; set; }
    public long RefNo { get; set; }
    public string MatchCode { get; set; }
    public int MatchId { get; set; }
    public int HomeId { get; set; }
    public int AwayId { get; set; }
    public decimal Hdp1 { get; set; }
    public decimal Hdp2 { get; set; }
    public decimal Odds { get; set; }
    public decimal MasterOdds { get; set; }
    public byte OddsType { get; set; }
    public string Status { get; set; }
    public decimal Stake { get; set; }
    public DateTime TransDate { get; set; }
    public string BetTeam { get; set; }
    public bool LiveIndicator { get; set; }
    public string UserName { get; set; }
    public short LiveHomeScore { get; set; }
    public short LiveAwayScore { get; set; }
    public int LeagueId { get; set; }
    public int SportType { get; set; }
    public bool IsNeutral { get; set; }
    public string WinLost { get; set; }
    public decimal Commission { get; set; }
    public string ShowTime { get; set; }
    public string BetCheck { get; set; }
    public string TransDesc { get; set; }
    public bool IsDeposit { get; set; }
    public bool IsCashOut { get; set; }
    public bool IsHideComm { get; set; }
    public string GroupName { get; set; }
    public string ExtraInfo { get; set; }
    public long BetdaqId { get; set; }
    public byte WalletType { get; set; }
    public long MainTransId { get; set; }
    public string CurrencyName { get; set; }
    public long FollowedId { get; set; }
    public string FollowedUserName { get; set; }
    public long? RefCode { get; set; }
    public decimal OddsSpread { get; set; }
    public string LicenseeName { get; set; }
    public byte SettlementStatus { get; set; }
    public bool IsMarked { get; set; }
    public decimal ActualStake { get; set; }
    public DateTime WinLostDate { get; set; }
    public DateTime EndTime { get; set; }
    public int SiteDbGroupId { get; set; }
    public bool SecAcceptFlag { get; set; }
    public string SubTransId { get; set; }
    public bool IsHybrid { get; set; }
}

public class GetTicketValidation
{
    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }

    public int? MatchId { get; set; }
}