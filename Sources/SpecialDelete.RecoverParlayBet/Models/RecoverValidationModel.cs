using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverParlayBet.Models;

public class RecoverValidationModel : Result
{
    public string SettledMainTranIds { get; set; }

    public string NegativeBalanceUsers { get; set; }
}