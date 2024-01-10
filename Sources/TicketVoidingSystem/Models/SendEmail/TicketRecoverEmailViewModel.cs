namespace TicketVoidingSystem.Models.SendEmail;

public class TicketRecoverEmailViewModel
{
    public int No { get; set; }

    public string BetId { get; set; }

    public string Player { get; set; }

    public string TransDate { get; set; }

    public string BetType { get; set; }

    public string Choice { get; set; }

    public string Stake { get; set; }

    public string Odds { get; set; }

    public string Status { get; set; }

    public string Handicap { get; set; }

    public string Score { get; set; }

    public string WinLost { get; set; }

    public string MainTransId { get; set; }

    public bool IsDisable { get; set; }

    public bool IsCricket { get; set; }

    public int SiteDbGroupId { get; set; }

    public string BetFrom { get; set; }
}