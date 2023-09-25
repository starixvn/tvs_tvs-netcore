using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Models;

public class VoidTicketsModel
{
    public IEnumerable<TicketEmailModel> Tickets { get; set; }

    public VoidTicketsValidation Validation { get; set; }
}

public class VoidTicketsValidation : Result
{
    public string NegativeBalanceUsers { get; set; }
}