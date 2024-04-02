namespace SpecialDelete.VoidByCurrency.Models;

using System;

public class GetTicketModel
{
    public decimal Stake { get; set; }

    public long AwayId { get; set; }

    public string BetCheck { get; set; }

    public long BetId { get; set; }

    public string BetTeam { get; set; }

    public int BetType { get; set; }

    public string CurrencyCode { get; set; }

    public decimal Hdp1 { get; set; }

    public decimal Hdp2 { get; set; }

    public long HomeId { get; set; }

    public bool IsLiveIndicator { get; set; }

    public bool IsNeutral { get; set; }

    public bool IsSecondAcceptFlag { get; set; }

    public int LiveAwayScore { get; set; }

    public int LiveHomeScore { get; set; }

    public decimal Odds { get; set; }

    public bool IsMixParlay { get; set; }

    public bool IsCashOut { get; set; }

    public bool IsCricket { get; set; }

    public int OddsType { get; set; }

    public long RefNo { get; set; }

    public int SportType { get; set; }

    public string Status { get; set; }

    public DateTime TransDate { get; set; }

    public string TransDesc { get; set; }

    public long TransId { get; set; }

    public string UserName { get; set; }

    public string WinLost { get; set; }

    public string GroupName { get; set; }

    public string SubStatus { get; set; }

    public long SubTransId { get; set; }

    public string SubBetCheck { get; set; }

    public string SubBetTeam { get; set; }

    public int SubBetType { get; set; }

    public decimal SubHdp1 { get; set; }

    public decimal SubHdp2 { get; set; }

    public decimal SubOdds { get; set; }

    public string ExtraInfo { get; set; }

    public long BetdaqId { get; set; }

    public byte WalletType { get; set; }

    public long MainTransId { get; set; }

    public long? RefCode { get; set; }

    public decimal OddsSpread { get; set; }

    public byte SettlementStatus { get; set; }

    public bool IsMarked { get; set; }

    public decimal ActualStake { get; set; }

    public int SiteDbGroupId { get; set; }

    public decimal MasterOdds { get; set; }
}