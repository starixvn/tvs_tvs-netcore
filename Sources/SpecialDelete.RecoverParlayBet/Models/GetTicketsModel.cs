namespace SpecialDelete.RecoverParlayBet.Models;

using System.Collections.Generic;

public class GetTicketsModel<T>
{
    public GetTicketsModel()
    {
        Tickets = new List<T>();
        InvalidTransIds = new List<InvalidTransIds>();
    }

    public IEnumerable<InvalidTransIds> InvalidTransIds { get; set; }

    public IEnumerable<T> Tickets { get; set; }
}