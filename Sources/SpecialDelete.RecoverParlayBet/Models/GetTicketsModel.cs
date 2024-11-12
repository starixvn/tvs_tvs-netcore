namespace SpecialDelete.RecoverParlayBet.Models;

using System.Collections.Generic;

public class GetTicketsModel<T>
{
    public IEnumerable<InvalidTransIds> InvalidTransIds { get; set; } = new List<InvalidTransIds>();

    public IEnumerable<T> Tickets { get; set; } = new List<T>();
}