using System.Collections.Generic;

namespace TicketVoidingSystem.Models
{
    public class BetId
    {
        public string TransId { get; set; }
        public int SiteDbGroupId { get; set; }
        public int MatchId { get; set; }
    }

    public class BetIdEqualityComparer : IEqualityComparer<BetId>
    {
        public bool Equals(BetId x, BetId y)
        {
            if (x == null && y == null)
            {
                return true;
            }

            if (x is null || y is null)
            {
                return false;
            }

            if (x.GetType() != y.GetType())
            {
                return false;
            }

            return x.TransId == y.TransId && x.SiteDbGroupId == y.SiteDbGroupId && x.MatchId == y.MatchId;
        }

        public int GetHashCode(BetId obj)
        {
            return obj.TransId.GetHashCode() + obj.SiteDbGroupId.GetHashCode() + obj.MatchId.GetHashCode();
        }
    }
}
