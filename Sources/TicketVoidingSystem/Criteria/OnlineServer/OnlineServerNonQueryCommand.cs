using System;
using Fanex.Data;
using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.OnlineServer;

public interface IOnlineServerNonQueryCommand : INonQueryCommand, ISiteDbGroupAssignable, ICloneable;

public abstract class OnlineServerNonQueryCommand : CriteriaBase, IOnlineServerNonQueryCommand
{
    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public object Clone()
    {
        return MemberwiseClone();
    }
}