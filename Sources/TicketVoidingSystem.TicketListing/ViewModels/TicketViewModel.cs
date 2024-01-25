namespace TicketVoidingSystem.TicketListing.ViewModels;

public class TicketViewModel
{
    public string BetId { get; set; }

    public string TransDate { get; set; }

    public string Member { get; set; }

    public string Choice { get; set; }

    public string Odds { get; set; }

    public string Stake { get; set; }

    public string WinLoss { get; set; }

    public string Currency { get; set; }

    public string BetType { get; set; }

    public string Status { get; set; }

    public string SecondAcceptFlag { get; set; }

    public byte? BallSequence { get; set; }

    public bool IsMarked { get; set; }

    public bool IsSite777 { get; set; }
}