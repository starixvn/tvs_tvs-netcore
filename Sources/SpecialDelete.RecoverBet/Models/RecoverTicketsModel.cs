using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverBet.Models;

public class RecoverTicketsModel
{
    public IEnumerable<BetId> TicketsForUpdateNetPosition { get; set; }

    public IEnumerable<RecoverTicketModel> Tickets { get; set; } = new List<RecoverTicketModel>();

    public RecoverTicketValidation Validation { get; set; }
}