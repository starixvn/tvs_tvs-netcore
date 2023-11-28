using SpecialDelete.CashOutTransaction.Common.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Models;

public class RecoverTicketModel : GetTicketModel, EmailRecoverSupport
{
    public DateTime DateTime { get; set; }

    public string CurrencyCode { get; set; }

    public bool IsItSupport { get; set; }

    public string BetFrom { get; set; }
}