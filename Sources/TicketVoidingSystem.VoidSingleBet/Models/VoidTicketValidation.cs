using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.VoidSingleBet.Models;

public class VoidTicketValidation : Result
{
    public string NegativeBalanceUsers { get; set; }

    public int SiteDbGroupId { get; set; }
}