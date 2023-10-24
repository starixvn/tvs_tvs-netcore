using TicketVoidingSystem.Models;

namespace SpecialDelete.VoidByCurrency.ViewModels;

public class TicketsViewModel
{
    public TicketsViewModel()
    {
        Groups = new List<Group<TicketViewModel>>();
    }

    public List<Group<TicketViewModel>> Groups { get; set; }

    public DateTime FromTransTime { get; set; }

    public DateTime ToTransTime { get; set; }

    public int TotalItems { get; set; }
}