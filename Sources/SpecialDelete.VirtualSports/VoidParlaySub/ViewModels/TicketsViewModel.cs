using SpecialDelete.VirtualSports.Common.ViewModels;
using TicketVoidingSystem.Models;

namespace SpecialDelete.VirtualSports.VoidParlaySub.ViewModels;

public class TicketsViewModel
{
    public List<Group<TicketViewModel>> Groups { get; set; } = [];

    public int TotalItems { get; set; }

    public string InvalidTransIds { get; set; }
}