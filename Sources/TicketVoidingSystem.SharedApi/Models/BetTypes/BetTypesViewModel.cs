using System.Collections.Generic;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.SharedApi.Models.BetTypes;

public class BetTypesViewModel
{
    public BetTypesViewModel()
    {
        Result = new Result();
    }

    public IEnumerable<BetTypeModel> BetTypes { get; set; }

    public Result Result { get; set; }
}