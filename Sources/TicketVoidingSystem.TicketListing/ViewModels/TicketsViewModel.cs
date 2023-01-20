namespace TicketVoidingSystem.TicketListing.ViewModels
{
    public class TicketsViewModel
    {
        public TicketsViewModel()
        {
            Tickets = new List<TicketViewModel>();
        }

        public IEnumerable<TicketViewModel> Tickets { get; set; }

        public int TotalItems { get; set; }
    }
}