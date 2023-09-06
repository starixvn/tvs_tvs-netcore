namespace TicketVoidingSystem.Models.SendEmail;

public class DuplicateTicketsRequestInfo
{
    public int Id { get; set; }

    public string OrgTransIds { get; set; }

    public int TotalOrgTransIds => OrgTransIds.Split(", ").Length;

    public string VoidedTransIds { get; set; }

    public string Usernames { get; set; }

    public string EmailGroup { get; set; }

    public string Site { get; set; }

    public bool IsItSupport { get; set; }

    public bool IsITSupportCreatedRequest { get; set; }

    public bool IsHasUusTickets { get; set; }
}