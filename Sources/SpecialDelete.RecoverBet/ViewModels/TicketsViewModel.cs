using SpecialDelete.RecoverBet.Models;
using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverBet.ViewModels;

public class TicketsViewModel
{
    public List<Group<TicketViewModel>> Groups { get; set; } = [];

    public IList<InvalidTransIds> InvalidTransIds { get; set; } = new List<InvalidTransIds>();

    public int TotalItem { get; set; }
}