using SpecialDelete.RecoverParlayBet.Models;
using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverParlayBet.ViewModels;

public class TicketsViewModel
{
    public IList<Group<TicketViewModel>> Groups { get; set; } = new List<Group<TicketViewModel>>();
    public IEnumerable<BetId> Tickets { get; set; }
    public IList<InvalidTransIds> InvalidTransIds { get; set; } = new List<InvalidTransIds>();
}