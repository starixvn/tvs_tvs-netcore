using System.Collections.Generic;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

public class GroupBetTypesViewModel
{
    public IEnumerable<GroupBetTypeModel> GroupBetTypes { get; set; }

    public Result Result { get; set; } = new();
}