using System;

namespace TicketVoidingSystem.Models
{
    public class GetTicketSiteDbModel
    {
        public decimal ActualStake { get; set; }
        public string BetCheck { get; set; }
        public long BetdaqId { get; set; }
        public string BetFrom { get; set; }
        public long BetId { get; set; }
        public string BetTeam { get; set; }
        public short BetType { get; set; }
        public int BonusId { get; set; }
        public DateTime? CheckTime { get; set; }
        public int Creator { get; set; }
        public string CurrencyName { get; set; }
        public int CustId { get; set; }
        public string ExtraInfo { get; set; }
        public decimal Hdp1 { get; set; }
        public decimal Hdp2 { get; set; }
        public bool IsMixParlay { get; set; }
        public bool IsMoved14 { get; set; }
        public int LiveHomeScore { get; set; }
        public int LiveAwayScore { get; set; }
        public short LiveBetAcceptTime { get; set; }
        public bool LiveIndicator { get; set; }
        public int MatchId { get; set; }
        public decimal MOdds { get; set; }
        public int MRecommend { get; set; }
        public decimal Odds { get; set; }
        public int OddsId { get; set; }
        public decimal OddsSpread { get; set; }
        public byte OddsType { get; set; }
        public int Recommend { get; set; }
        public long RefCode { get; set; }
        public string RefNo { get; set; }
        public short SecAcceptTime { get; set; }
        public int SiteDbGroupId { get; set; }
        public int SRecommend { get; set; }
        public decimal Stake { get; set; }
        public string Status { get; set; }
        public byte StatusId { get; set; }
        public short StatusWinLost { get; set; }
        public string SubBetCheck { get; set; }
        public string SubBetFrom { get; set; }
        public string SubBetTeam { get; set; }
        public short SubBetType { get; set; }
        public DateTime? SubCheckTime { get; set; }
        public int SubCustId { get; set; }
        public decimal SubHdp1 { get; set; }
        public decimal SubHdp2 { get; set; }
        public int SubLiveHomeScore { get; set; }
        public int SubLiveAwayScore { get; set; }
        public short SubLiveBetAcceptTime { get; set; }
        public bool SubLiveIndicator { get; set; }
        public string SubMatchIdList { get; set; }
        public decimal SubOdds { get; set; }
        public decimal SubOddsSpread { get; set; }
        public short SubSecAcceptTime { get; set; }
        public string SubStatus { get; set; }
        public byte SubStatusId { get; set; }
        public DateTime? SubTransDate { get; set; }
        public string SubTransdesc { get; set; }
        public string SubTransId { get; set; }
        public DateTime? TransDate { get; set; }
        public string Transdesc { get; set; }
        public string TransId { get; set; }
        public byte WalletType { get; set; }
        public decimal WinLost { get; set; }
        public DateTime? WinLostDate { get; set; }
    }
}