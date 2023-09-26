using SpecialDelete.VirtualSports.Common.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.VirtualSports.RecoverBet.Models;

public class RecoverTicketModel : GetTicketModel, EmailRecoverSupport
{
    public DateTime DateTime { get; set; }

    public string CurrencyCode { get; set; }

    public bool IsItSupport { get; set; }

    public string BetFrom { get; set; }
}