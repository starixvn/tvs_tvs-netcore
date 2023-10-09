using SpecialDelete.VirtualSports.Common.ViewModels;
using TicketVoidingSystem.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.ViewModels;

public class RecoverTicketsViewModel
{
    public RecoverTicketsViewModel()
    {
        Groups = new List<Group<TicketViewModel>>();
    }

    public List<Group<TicketViewModel>> Groups { get; set; }

    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }
}