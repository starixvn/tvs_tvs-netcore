namespace TicketVoidingSystem.TicketListing.Models;

public class SummaryTicketModel
{
    public string LicenseeName { get; set; }

    public int BetTypeId { get; set; }

    public bool LiveIndicator { get; set; }

    public long RefNo { get; set; }

    public int TotalTrans { get; set; }

    public string BetTypeName { get; set; }

    public bool IsChinaView { get; set; }

    public int SpecialPlatform { get; set; }
}