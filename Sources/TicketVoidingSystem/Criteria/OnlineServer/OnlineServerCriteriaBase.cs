using System;
using Fanex.Data;
using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.OnlineServer;

public interface IOnlineServerCriteria : ICriteria, ICloneable
{
    public int SiteDbGroupId { get; set; }
}

public abstract class OnlineServerCriteriaBase : CriteriaBase, IOnlineServerCriteria
{
    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public object Clone()
    {
        return MemberwiseClone();
    }
}