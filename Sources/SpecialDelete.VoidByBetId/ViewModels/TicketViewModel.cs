namespace SpecialDelete.VoidByBetId.ViewModels;

public class TicketViewModel
{
    public int No { get; set; }

    public string BetId { get; set; }

    public string Value { get; set; }

    public string Player { get; set; }

    public string TransDate { get; set; }

    public int BetType { get; set; }

    public string Choice { get; set; }

    public string Stake { get; set; }

    public string Odds { get; set; }

    public string Status { get; set; }

    public string WinLost { get; set; }

    public bool IsDisable { get; set; }

    public bool IsCricket { get; set; }

    public string MainTransId { get; set; }

    public bool IsMarked { get; set; }

    public int SiteDbGroupId { get; set; }
}