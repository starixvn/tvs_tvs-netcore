namespace TicketVoidingSystem.TicketListing.Models;

public class ExcelOicModel
{
    public long TransId { get; set; }

    public string UserName { get; set; }

    public string UserName2 { get; set; }

    public int CustId { get; set; }
}

public class DetailTicketModel : ExcelOicModel
{
    public int BetType { get; set; }

    public string ExtraInfo { get; set; }

    public long BetdaqId { get; set; }

    public long BetId { get; set; }

    public long RefNo { get; set; }

    public DateTime TransDate { get; set; }

    public decimal Odds { get; set; }

    public decimal Oddsspread { get; set; }

    public decimal MOdds { get; set; }

    public byte? BallSequence { get; set; }

    public decimal Stake { get; set; }

    public decimal ActualStake { get; set; }

    public string CurrencyName { get; set; }

    public string Status { get; set; }

    public long HomeId { get; set; }

    public long AwayId { get; set; }

    public string BetTeam { get; set; }

    public decimal Hdp1 { get; set; }

    public decimal Hdp2 { get; set; }

    public short LiveHomeScore { get; set; }

    public short LiveAwayScore { get; set; }

    public bool IsLiveIndicator { get; set; }

    public bool IsNeutral { get; set; }

    public int OddsType { get; set; }

    public string WinLost { get; set; }

    public string BetCheck { get; set; }

    public int SportType { get; set; }

    public string TransDesc { get; set; }

    public bool SecAcceptFlag { get; set; }

    public byte WalletType { get; set; }

    public bool IsParlay { get; set; }

    public long SubTransId { get; set; }

    public int SubBetType { get; set; }

    public string SubBetTeam { get; set; }

    public short SubLiveHomeScore { get; set; }

    public short SubLiveAwayScore { get; set; }

    public bool SubLiveIndicator { get; set; }

    public decimal SubOdds { get; set; }

    public decimal SubHdp1 { get; set; }

    public decimal SubHdp2 { get; set; }

    public long SubHomeId { get; set; }

    public long SubAwayId { get; set; }

    public string SubBetCheck { get; set; }

    public string SubTransDesc { get; set; }

    public int SubSportType { get; set; }

    public long? RefCode { get; set; }

    public byte SettlementStatus { get; set; }

    public bool IsMarked { get; set; }
}