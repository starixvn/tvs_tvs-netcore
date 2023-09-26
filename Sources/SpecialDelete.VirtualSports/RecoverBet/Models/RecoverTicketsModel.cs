using TicketVoidingSystem.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.Models;

using System.Collections.Generic;

public class RecoverTicketsModel
{
    public IEnumerable<RecoverTicketModel> Tickets { get; set; }

    public RecoverTicketsValidation Validation { get; set; }
}

public class RecoverTicketsValidation : Result
{
    public string CompletedMatchIds { get; set; }

    public string ReCalculatedMainTransIds { get; set; }

    public string NegativeBalanceUsers { get; set; }
}