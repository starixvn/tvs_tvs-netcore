using System.Collections.Generic;

namespace TicketVoidingSystem.Models;

public class Group<T>
{
    public Group()
    {
        Tickets = new List<T>();
        Name = string.Empty;
    }

    public string Name { get; set; }

    public int DisplayTotalTickets { get; set; }

    public IEnumerable<T> Tickets { get; set; }
}