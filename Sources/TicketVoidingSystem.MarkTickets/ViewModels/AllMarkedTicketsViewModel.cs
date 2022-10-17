namespace TicketVoidingSystem.MarkTickets.ViewModels
{
    using System.Collections.Generic;

    public class AllMarkedTicketsViewModel
    {
        public IEnumerable<AllMarkedTicketViewModel> TicketList { get; set; }

        public int TotalItems { get; set; }
    }
}