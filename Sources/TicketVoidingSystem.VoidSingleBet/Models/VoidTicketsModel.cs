using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.VoidSingleBet.Models;

public class VoidTicketsModel
{
    public IEnumerable<TicketEmailModel> Tickets { get; set; }

    public VoidTicketValidation Validation { get; set; }

    public IEnumerable<BetId> TicketsRollbackNetPosition { get; set; }
}