namespace SpecialDelete.NumberGame.Models;

using System.Collections.Generic;

public class GetTicketsModel
{
    public string InvalidTransIds { get; set; }

    public List<GetTicketModel> Tickets { get; set; }
}