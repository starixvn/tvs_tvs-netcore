using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverByBetId.ViewModels;

public class TicketsViewModel
{
    public List<Group<TicketViewModel>> Groups { get; set; } = new();

    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }
}