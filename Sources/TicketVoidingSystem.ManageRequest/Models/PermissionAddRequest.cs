namespace TicketVoidingSystem.ManageRequest.Models;

public class PermissionAddRequest
{
    public bool IsVoidAllArchivedTickets { get; set; }
    public bool IsAddSettledTickets { get; set; }
    public bool IsAddInstantlySettledTickets { get; set; }
}