namespace TicketVoidingSystem.VoidSingleBet.Models;

public class UserPermission
{
    public bool SettledTicket { get; set; }

    public bool UnSettledTicket { get; set; }

    public bool InstantlySettledTicket { get; set; }

    public bool ReadOnly => !SettledTicket && !UnSettledTicket && !InstantlySettledTicket;
}