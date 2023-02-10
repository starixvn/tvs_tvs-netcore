using System;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

public class GetDetailTicketsQuery
{
    public int MatchId { get; set; }

    public int UserId { get; set; }

    public DateTime CreatedDate { get; set; }

    public Match Match { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }
}