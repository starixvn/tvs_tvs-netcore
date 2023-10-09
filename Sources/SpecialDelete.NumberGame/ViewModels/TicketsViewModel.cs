using TicketVoidingSystem.Models;

namespace SpecialDelete.NumberGame.ViewModels;

public class TicketsViewModel
{
    public TicketsViewModel()
    {
        Groups = new List<Group<TicketViewModel>>();
    }

    public List<Group<TicketViewModel>> Groups { get; set; }

    public string InvalidTransIds { get; set; }

    public int TotalItems { get; set; }
}