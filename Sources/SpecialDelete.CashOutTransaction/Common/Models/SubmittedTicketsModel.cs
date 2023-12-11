using TicketVoidingSystem.Models;

namespace SpecialDelete.CashOutTransaction.Common.Models;

public class SubmittedTicketsModel<T>
{
    public IEnumerable<T> Tickets { get; set; }

    public SubmittedTicketsValidation Validation { get; set; }
}

public class SubmittedTicketsValidation : Result
{
    public string InvalidTransIds { get; set; }
}