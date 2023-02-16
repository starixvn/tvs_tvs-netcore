namespace TicketVoidingSystem.VoidSingleBet.Models;

public class VoidTicketsModel
{
    public IEnumerable<TicketEmailModel> Tickets { get; set; }

    public VoidTicketValidation Validation { get; set; }

    public bool IsNeedToRollBackNetPosition { get; set; }
}