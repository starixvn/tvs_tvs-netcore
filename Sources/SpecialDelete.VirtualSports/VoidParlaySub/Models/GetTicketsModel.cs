using SpecialDelete.VirtualSports.Common.Models;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Models;

public class GetTicketsModel
{
    public List<GetTicketModel> Tickets { get; set; }

    public string InvalidTransIds { get; set; }
}