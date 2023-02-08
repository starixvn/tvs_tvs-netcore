using System.Collections.Generic;

namespace TicketVoidingSystem.SharedApi.Models.BetTypes
{
    public class BetTypeVirtualSport
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }

    public class GroupBetTypeVirtualSport
    {
        public IEnumerable<int> SportTypes { get; set; }

        public IEnumerable<BetTypeVirtualSport> BetTypes { get; set; }
    }

    public class BetTypesArea
    {
        public IList<GroupBetTypeVirtualSport> Groups { get; set; }
    }
}