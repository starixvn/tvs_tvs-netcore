using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.VoidByCurrency.Models;

public class VoidTicketsModel
{
    public IEnumerable<TicketEmailModel> Tickets { get; set; }

    public VoidTicketsValidation Validation { get; set; }

    public IEnumerable<BetId> TicketsRollbackNetPosition { get; set; }
}