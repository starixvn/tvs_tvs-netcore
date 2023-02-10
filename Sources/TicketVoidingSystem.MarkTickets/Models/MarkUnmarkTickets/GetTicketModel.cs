using System;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

public class GetTicketModel
{
    public long TransId { get; set; }

    public long FollowedId { get; set; }

    public string UserName { get; set; }

    public string FollowedUsername { get; set; }

    public long? BetId { get; set; }

    public DateTime TransDate { get; set; }

    public short BetType { get; set; }

    public string CurrencyName { get; set; }

    public string Status { get; set; }

    public bool IsLiveIndicator { get; set; }

    public short LiveHomeScore { get; set; }

    public short LiveAwayScore { get; set; }

    public bool IsCricket { get; set; }

    public int SportType { get; set; }

    public string BetTeam { get; set; }

    public decimal Stake { get; set; }

    public decimal Odds { get; set; }

    public int OddsType { get; set; }

    public string BetCheck { get; set; }

    public decimal Hdp1 { get; set; }

    public decimal Hdp2 { get; set; }

    public string TransDesc { get; set; }

    public long RefNo { get; set; }

    public string GroupName { get; set; }

    public string ExtraInfo { get; set; }

    public long BetdaqId { get; set; }

    public byte WalletType { get; set; }

    public long MainTransId { get; set; }

    public long? RefCode { get; set; }

    public decimal OddsSpread { get; set; }

    public string WinLost { get; set; }

    public string LicenseeName { get; set; }

    public byte SettlementStatus { get; set; }

    public int HomeId { get; set; }

    public int AwayId { get; set; }

    public int SportTypeId { get; set; }

    public int LeagueId { get; set; }

    public bool IsNeutral { get; set; }

    public string MatchCode { get; set; }

    public bool IsDeposit { get; set; }

    public bool IsMixParlay { get; set; }

    public long SubTransId { get; set; }

    public string SubStatus { get; set; }

    public string SubBetCheck { get; set; }

    public string SubBetTeam { get; set; }

    public short SubBetType { get; set; }

    public decimal SubHdp1 { get; set; }

    public decimal SubHdp2 { get; set; }

    public decimal SubOdds { get; set; }

    public decimal ActualStake { get; set; }

    public int SiteDbGroupId { get; set; }
}

public class GetTicketValidationModel : Result
{
    public string InvalidTransIds { get; set; }

    public string MarkedTransIds { get; set; }

    public string MovedTransIds { get; set; }
}