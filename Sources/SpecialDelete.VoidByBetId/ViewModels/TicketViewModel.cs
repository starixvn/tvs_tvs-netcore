namespace SpecialDelete.VoidByBetId.ViewModels;

public class TicketViewModel
{
    public int No { get; set; }

    public string BetId { get; set; }

    public string Value { get; set; }

    public string Member { get; set; }

    public string TransDate { get; set; }

    public string BetType { get; set; }

    public string Choice { get; set; }

    public string Stake { get; set; }

    public string Odds { get; set; }

    public string Status { get; set; }

    public string WinLoss { get; set; }

    public bool IsDisable { get; set; }

    public bool IsCricket { get; set; }

    public string MainTransId { get; set; }

    public bool IsMarked { get; set; }

    public int SiteDbGroupId { get; set; }

    public string Currency { get; set; }

    public string Handicap { get; set; }

    public string Score { get; set; }

    public string SecondAcceptFlag { get; set; } = "";

    public long BetdaqId { get; set; }
    
    public string SubTransId { get; set; }

    public bool IsHybrid { get; set; }
}