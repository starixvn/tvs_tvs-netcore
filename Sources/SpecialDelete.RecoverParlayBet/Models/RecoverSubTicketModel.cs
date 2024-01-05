using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.RecoverParlayBet.Models;

public class RecoverSubTicketModel : GetSubTicket, EmailSupport, EmailRecoverSupport
{
    public string CurrencyCode { get; set; }

    public DateTime DateTime { get; set; }

    public bool IsCsd { get; set; }

    public bool IsItQa { get; set; }

    public bool IsItSupport { get; set; }
}