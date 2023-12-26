using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.RecoverBet.Models;

public class RecoverTicketModel : GetTicketModel, EmailRecoverSupport
{
    public string BetFrom { get; set; }

    public bool IsReal { get; set; }

    public bool IsItQa { get; set; }

    public bool IsItSupport { get; set; }

    public bool IsCashOut { get; set; }

    public bool IsSettled { get; set; }

    public string CurrencyCode { get; set; }
}

public class RecoverTicketValidation : Result
{
    public int SiteDbGroupId { get; set; }

    public string AutoReSettledTransIds { get; set; }
}