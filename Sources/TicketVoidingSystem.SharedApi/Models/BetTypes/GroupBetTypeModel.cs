using System.Collections.Generic;

namespace TicketVoidingSystem.SharedApi.Models.BetTypes
{
    public class GroupBetTypeModel
    {
        public string GroupName { get; set; }

        public IEnumerable<BetTypeModel> BetTypes { get; set; }
    }
}