namespace TicketVoidingSystem.MarkTickets.Models
{
    public class UserPermission
    {
        public bool MarkTickets { get; set; }

        public bool ViewUserName { get; set; }

        public bool ReadOnly => !MarkTickets;
    }
}
