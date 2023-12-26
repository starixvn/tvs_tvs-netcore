using SpecialDelete.RecoverParlayBet.Models;
using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverParlayBet.ViewModels;

public class TicketsViewModel
{
    public TicketsViewModel()
    {
        Groups = new List<Group<TicketViewModel>>();
        InvalidTransIds = new List<InvalidTransIds>();
    }

    public IList<Group<TicketViewModel>> Groups { get; set; }
    public IEnumerable<BetId> Tickets { get; set; }
    public IList<InvalidTransIds> InvalidTransIds { get; set; }
}