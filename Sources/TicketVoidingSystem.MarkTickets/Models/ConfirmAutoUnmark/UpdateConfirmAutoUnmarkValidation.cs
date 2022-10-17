using SpecialDelete.Core.DTO;

namespace TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark
{
    public class UpdateConfirmAutoUnmarkValidation : Result
    {
        public string NegativeBalanceUsers { get; set; }
    }
}