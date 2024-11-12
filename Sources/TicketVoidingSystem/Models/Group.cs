using System.Collections.Generic;

namespace TicketVoidingSystem.Models;

public class Group<T>
{
    public string Name { get; set; } = string.Empty;

    public int DisplayTotalTickets { get; set; }

    public IEnumerable<T> Tickets { get; set; } = new List<T>();
}