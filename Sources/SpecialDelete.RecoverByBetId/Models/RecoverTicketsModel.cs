namespace SpecialDelete.RecoverByBetId.Models;

public class RecoverTicketsModel
{
    public IEnumerable<RecoverTicketModel> Tickets { get; set; }

    public RecoverTicketValidation Validation { get; set; }
}