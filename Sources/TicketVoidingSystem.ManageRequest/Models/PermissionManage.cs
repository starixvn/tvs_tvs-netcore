namespace TicketVoidingSystem.ManageRequest.Models;

public class PermissionManage
{
    public bool ManageRequestHost { get; set; }
    public bool VerifyRead { get; set; }
    public bool VerifyHost { get; set; }
    public bool VoidRead { get; set; }
    public bool ManageRequestUnsettledTicketsHost { get; set; }
    public bool ManageRequestSettledTicketsHost { get; set; }
    public bool IsReadMarkTickets { get; set; }
}