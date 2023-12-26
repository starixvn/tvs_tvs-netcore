using SpecialDelete.RecoverBet.Models;
using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverBet.ViewModels;

public class TicketsViewModel
{
    public TicketsViewModel()
    {
        Groups = new List<Group<TicketViewModel>>();
        InvalidTransIds = new List<InvalidTransIds>();
    }

    public List<Group<TicketViewModel>> Groups { get; set; }

    public IList<InvalidTransIds> InvalidTransIds { get; set; }

    public int TotalItem { get; set; }
}