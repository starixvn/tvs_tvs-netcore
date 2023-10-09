using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.RecoverByBetId.Models;

public class RecoverTicketModel : GetTicketModel, EmailRecoverSupport
{
    public DateTime DateTime { get; set; }

    public int Currency { get; set; }

    public bool IsItSupport { get; set; }

    public string BetFrom { get; set; }

    public string CurrencyCode { get; set; }
}

public class RecoverTicketValidation : Result
{
    public string ReCalcMatches { get; set; }
}