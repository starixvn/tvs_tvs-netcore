namespace SpecialDelete.RecoverBet.Models;

using System.Collections.Generic;

public class GetTicketsModel
{
    public List<InvalidTransIds> InvalidTrans { get; set; } = [];

    public List<GetTicketModel> Tickets { get; set; } = [];
}