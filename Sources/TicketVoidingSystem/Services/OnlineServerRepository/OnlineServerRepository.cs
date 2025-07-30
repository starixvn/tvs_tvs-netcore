using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Criteria.OnlineServer;

namespace TicketVoidingSystem.Services.OnlineServerRepository;

public interface OnlineServerRepository
{
    /// <summary>
    /// Execute FetchAsync on all online servers and flatten results
    /// </summary>
    Task<IEnumerable<T>> FetchAsync<T>(IOnlineServerCriteria criteria);

    /// <summary>
    /// Execute FetchMultipleAsync on all online servers for 2 types and flatten results
    /// </summary>
    Task<(IEnumerable<T1>, IEnumerable<T2>)> FetchMultipleAsync<T1, T2>(IOnlineServerCriteria criteria);

    /// <summary>
    /// Execute FetchMultipleAsync on all online servers for 3 types and flatten results
    /// </summary>
    Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>)> FetchMultipleAsync<T1, T2, T3>(IOnlineServerCriteria criteria);

    /// <summary>
    /// Execute FetchMultipleAsync on all online servers for 4 types and flatten results
    /// </summary>
#pragma warning disable S2436

    Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>)> FetchMultipleAsync<T1, T2, T3, T4>(IOnlineServerCriteria criteria);

#pragma warning restore S2436

    /// <summary>
    /// Execute FetchMultipleAsync on all online servers for 5 types and flatten results
    /// </summary>
#pragma warning disable S2436

    Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>, IEnumerable<T5>)> FetchMultipleAsync<T1, T2, T3, T4, T5>(IOnlineServerCriteria criteria);

#pragma warning restore S2436

    /// <summary>
    /// Execute ExecuteAsync on all online servers
    /// </summary>
    Task<List<int>> ExecuteAsync(IOnlineServerNonQueryCommand command);

    /// <summary>
    /// Return Online Server IDs as a comma-separated string
    /// </summary>
    Task<string> GetOnlineServerIds();
}

public class OnlineServerRepositoryImp(IDynamicRepository repository,
    OnlineServerRepositoryBaseService onlineServerBaseService)
    : OnlineServerRepository
{
    public async Task<IEnumerable<T>> FetchAsync<T>(IOnlineServerCriteria criteria)
    {
        var results = await onlineServerBaseService.ExecuteAsync(criteria,
            async (serverCriteria) => await repository.FetchAsync<T>(serverCriteria));

        return results.SelectMany(x => x);
    }

    public async Task<(IEnumerable<T1>, IEnumerable<T2>)> FetchMultipleAsync<T1, T2>(IOnlineServerCriteria criteria)
    {
        var results = await onlineServerBaseService.ExecuteAsync(criteria,
            async (serverCriteria) => await repository.FetchMultipleAsync<T1, T2>(serverCriteria));

        var item1Results = results.SelectMany(x => x.Item1);
        var item2Results = results.SelectMany(x => x.Item2);

        return (item1Results, item2Results);
    }

    public async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>)> FetchMultipleAsync<T1, T2, T3>(IOnlineServerCriteria criteria)
    {
        var results = await onlineServerBaseService.ExecuteAsync(criteria,
            async (serverCriteria) => await repository.FetchMultipleAsync<T1, T2, T3>(serverCriteria));

        var item1Results = results.SelectMany(x => x.Item1);
        var item2Results = results.SelectMany(x => x.Item2);
        var item3Results = results.SelectMany(x => x.Item3);

        return (item1Results, item2Results, item3Results);
    }

#pragma warning disable S2436

    public async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>)> FetchMultipleAsync<T1, T2, T3, T4>(IOnlineServerCriteria criteria)
#pragma warning restore S2436
    {
        var results = await onlineServerBaseService.ExecuteAsync(criteria,
            async (serverCriteria) => await repository.FetchMultipleAsync<T1, T2, T3, T4>(serverCriteria));

        var item1Results = results.SelectMany(x => x.Item1);
        var item2Results = results.SelectMany(x => x.Item2);
        var item3Results = results.SelectMany(x => x.Item3);
        var item4Results = results.SelectMany(x => x.Item4);

        return (item1Results, item2Results, item3Results, item4Results);
    }

#pragma warning disable S2436

    public async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>, IEnumerable<T5>)> FetchMultipleAsync<T1, T2, T3, T4, T5>(IOnlineServerCriteria criteria)
#pragma warning restore S2436
    {
        var results = await onlineServerBaseService.ExecuteAsync(criteria,
            async (serverCriteria) => await repository.FetchMultipleAsync<T1, T2, T3, T4, T5>(serverCriteria));

        var item1Results = results.SelectMany(x => x.Item1);
        var item2Results = results.SelectMany(x => x.Item2);
        var item3Results = results.SelectMany(x => x.Item3);
        var item4Results = results.SelectMany(x => x.Item4);
        var item5Results = results.SelectMany(x => x.Item5);

        return (item1Results, item2Results, item3Results, item4Results, item5Results);
    }

    public async Task<List<int>> ExecuteAsync(IOnlineServerNonQueryCommand command)
    {
        return await onlineServerBaseService.ExecuteAsync(command,
            async (serverCommand) => await repository.ExecuteAsync(serverCommand));
    }

    public async Task<string> GetOnlineServerIds()
    {
        return await onlineServerBaseService.GetOnlineServerIds();
    }
}