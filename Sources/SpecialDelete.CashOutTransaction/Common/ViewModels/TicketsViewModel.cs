using TicketVoidingSystem.Models;

namespace SpecialDelete.CashOutTransaction.Common.ViewModels;

public class TicketsViewModel<T>
{
    public TicketsViewModel()
    {
        Groups = new List<Group<T>>();
    }

    public List<Group<T>> Groups { get; set; }

    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }

    public bool IsDiffMatchId { get; set; }

    public int TotalItem { get; set; }

    public bool IsCashOutAsUnSettledTicket { get; set; }
}