using SpecialDelete.VirtualSports.Common.ViewModels;
using TicketVoidingSystem.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.ViewModels;

public class RecoverTicketsViewModel
{
    public List<Group<TicketViewModel>> Groups { get; set; } = new();

    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }
}