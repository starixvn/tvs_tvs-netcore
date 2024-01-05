using System.Collections.Generic;

namespace SpecialDelete.RecoverParlayBet.Models;

public class InvalidTransIds
{
    public string InvalidTrans { get; set; }

    public bool IsMoved { get; set; }
}

public class InvalidTransIdsEqualityComparer : IEqualityComparer<InvalidTransIds>
{
    public bool Equals(InvalidTransIds x, InvalidTransIds y)
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

        return x.InvalidTrans == y.InvalidTrans && x.IsMoved == y.IsMoved;
    }

    public int GetHashCode(InvalidTransIds obj)
    {
        return obj.InvalidTrans.GetHashCode() + obj.IsMoved.GetHashCode();
    }
}