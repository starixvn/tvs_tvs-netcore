using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;

public class UpdateConfirmAutoUnmarkValidation : Result
{
    public string NegativeBalanceUsers { get; set; }
}