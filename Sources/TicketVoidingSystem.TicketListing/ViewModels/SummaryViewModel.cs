namespace TicketVoidingSystem.TicketListing.ViewModels;

public class SummaryViewModel : SummaryItem
{
    public IEnumerable<SummaryItem> Items { get; set; }
}

public class SummaryItem
{
    public string Name { get; set; }

    public int Total { get; set; }

    public string BetTypes { get; set; }

    public string LicenseeName { get; set; }

    public bool IsChinaView { get; set; }
}