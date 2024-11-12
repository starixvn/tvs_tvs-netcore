namespace TicketVoidingSystem.TicketListing.ViewModels;

public class TicketsViewModel
{
    public IEnumerable<TicketViewModel> Tickets { get; set; } = new List<TicketViewModel>();

    public int TotalItems { get; set; }
}