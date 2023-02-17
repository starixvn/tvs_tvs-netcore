namespace TicketVoidingSystem.TicketListing.Models;

public static class SiteAmendmentOic
{
    public const int SpecialDelete = 0;
}

public class AmendmentOicQuery
{
    public int SiteId { get; set; }

    public string Title { get; set; }

    public DateTime ReceivedDate { get; set; }

    public DateTime EventDate { get; set; }

    public Dictionary<string, string> Details { get; set; }

    public bool IsTest { get; set; }
}

public class AmendmentResponse
{
    public int Code { get; set; }

    public string Message { get; set; }

    public bool IsChinaView { get; set; }
}

public class LicenseeFile
{
    public string Name { get; set; }

    public string SessionID { get; set; }
}