using SpecialDelete.VirtualSports.Common.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.Models;

public class GetTicketsModel
{
    public IEnumerable<GetTicketModel> Tickets { get; set; }

    public GetTicketsValidation Validation { get; set; }
}

public class GetTicketsValidation
{
    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }
}