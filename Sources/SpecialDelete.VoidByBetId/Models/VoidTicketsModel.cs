using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.VoidByBetId.Models;

public class VoidTicketsModel
{
    public VoidTicketsModel()
    {
        Tickets = new List<TicketEmailModel>();
    }

    public IEnumerable<TicketEmailModel> Tickets { get; set; }

    public VoidTicketValidation Validation { get; set; }

    public IEnumerable<BetId> TicketsRollbackNetPosition { get; set; }
}