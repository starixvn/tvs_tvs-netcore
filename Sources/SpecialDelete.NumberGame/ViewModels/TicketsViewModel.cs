using TicketVoidingSystem.Models;

namespace SpecialDelete.NumberGame.ViewModels;

public class TicketsViewModel
{
    public List<Group<TicketViewModel>> Groups { get; set; } = new();

    public string InvalidTransIds { get; set; }

    public int TotalItems { get; set; }
}