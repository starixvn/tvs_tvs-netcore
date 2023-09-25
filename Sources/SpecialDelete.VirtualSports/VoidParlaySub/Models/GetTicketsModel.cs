namespace SpecialDelete.VirtualSports.VoidParlaySub.Models;

using System.Collections.Generic;
using Common.Models;

public class GetTicketsModel
{
    public List<GetTicketModel> Tickets { get; set; }

    public string InvalidTransIds { get; set; }
}