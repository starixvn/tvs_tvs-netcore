namespace SpecialDelete.RecoverBet.Models;

using System.Collections.Generic;

public class GetTicketsModel
{
    public GetTicketsModel()
    {
        Tickets = new List<GetTicketModel>();
        InvalidTrans = new List<InvalidTransIds>();
    }

    public List<InvalidTransIds> InvalidTrans { get; set; }

    public List<GetTicketModel> Tickets { get; set; }
}