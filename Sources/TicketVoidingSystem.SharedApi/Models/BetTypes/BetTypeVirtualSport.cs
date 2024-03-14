using System.Collections.Generic;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.SharedApi.Models.BetTypes;

public class GroupBetTypeVirtualSport
{
    public GroupBetTypeVirtualSport()
    {
        Result = new Result();
    }

    public Result Result { get; set; }
    public IEnumerable<BetTypeVirtualSport> BetTypes { get; set; }
}

public class BetTypeVirtualSport
{
    public int Id { get; set; }

    public string Name { get; set; }
}

public class GroupBetTypeVoidParlayVirtualSport
{
    public IEnumerable<int> SportTypes { get; set; }
    public IEnumerable<BetTypeVirtualSport> BetTypes { get; set; }
}

public class BetTypesVoidParlayVirtualSport
{
    public IList<GroupBetTypeVoidParlayVirtualSport> Groups { get; set; }
}