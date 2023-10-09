namespace SpecialDelete.RecoverByBetId.ViewModels;

public class TicketViewModel
{
    public int No { get; set; }

    public string BetId { get; set; }

    public string Member { get; set; }

    public string TransDate { get; set; }

    public string Odds { get; set; }

    public string Stake { get; set; }

    public string WinLoss { get; set; }

    public string Status { get; set; }

    public string Choice { get; set; }

    public string Value { get; set; }

    public bool IsDisable { get; set; }

    public int SiteDbGroupId { get; set; }
}