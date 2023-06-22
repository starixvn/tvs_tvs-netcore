namespace TicketVoidingSystem.ManageRequest.Models;

public class VoidPermission
{
    public bool Settled { get; set; }

    public bool UnSettled { get; set; }

    public bool InstantlySettled { get; set; }

    public bool Archived { get; set; }

    public bool ReadOnly => !Settled && !UnSettled && !InstantlySettled;
}