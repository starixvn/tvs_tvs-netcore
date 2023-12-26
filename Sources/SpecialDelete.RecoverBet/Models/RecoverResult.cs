using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverBet.Models;

using System.Collections.Generic;

public class RecoverResult
{
    public RecoverResult()
    {
        Results = new List<Result>();
    }

    public bool IsSettledBet { get; set; }

    public List<Result> Results { get; set; }
}