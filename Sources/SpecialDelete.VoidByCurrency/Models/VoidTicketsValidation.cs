using TicketVoidingSystem.Models;

namespace SpecialDelete.VoidByCurrency.Models;

public class VoidTicketsValidation : Result
{
    public int SiteDbGroupId { get; set; }

    public string NegativeBalanceUsers { get; set; }
}