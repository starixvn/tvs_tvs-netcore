namespace SpecialDelete.CashOutTransaction.Common.Models;

using System.Collections.Generic;

public class GetTicketsModel
{
    public List<GetTicketModel> Tickets { get; set; }

    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }

    public bool IsDiffMatchId { get; set; }
}