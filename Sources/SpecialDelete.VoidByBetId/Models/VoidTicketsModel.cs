using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.VoidByBetId.Models;

public class VoidTicketsModel
{
    public IEnumerable<TicketEmailModel> Tickets { get; set; } = new List<TicketEmailModel>();

    public VoidTicketValidation Validation { get; set; }

    public IEnumerable<BetId> TicketsRollbackNetPosition { get; set; }
}