using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverByBetId.ViewModels;

public class TicketsViewModel
{
    public TicketsViewModel()
    {
        Groups = new List<Group<TicketViewModel>>();
    }

    public List<Group<TicketViewModel>> Groups { get; set; }

    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }
}