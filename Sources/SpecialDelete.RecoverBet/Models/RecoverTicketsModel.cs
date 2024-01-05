using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverBet.Models;

public class RecoverTicketsModel
{
    public RecoverTicketsModel()
    {
        Tickets = new List<RecoverTicketModel>();
    }

    public IEnumerable<BetId> TicketsForUpdateNetPosition { get; set; }

    public IEnumerable<RecoverTicketModel> Tickets { get; set; }

    public RecoverTicketValidation Validation { get; set; }
}