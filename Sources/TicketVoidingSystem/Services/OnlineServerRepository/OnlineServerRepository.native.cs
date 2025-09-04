using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Fanex.SiteDbConnectionManager.Client.Services;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services.OnlineServerRepository;

public interface OnlineServerRepository
{
    /// <summary>
    /// Execute FetchAsync on all online servers and flatten results
    /// </summary>
    Task<IEnumerable<T>> FetchAsync<T>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast);

    /// <summary>
    /// Execute FetchMultipleAsync on all online servers for 2 types and flatten results
    /// </summary>
    Task<(IEnumerable<T1>, IEnumerable<T2>)> FetchMultipleAsync<T1, T2>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast);

    /// <summary>
    /// Execute FetchMultipleAsync on all online servers for 3 types and flatten results
    /// </summary>
    Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>)> FetchMultipleAsync<T1, T2, T3>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast);

    /// <summary>
    /// Execute FetchMultipleAsync on all online servers for 4 types and flatten results
    /// </summary>

    Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>)>
        FetchMultipleAsync<T1, T2, T3, T4>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast);

    /// <summary>
    /// Execute FetchMultipleAsync on all online servers for 5 types and flatten results
    /// </summary>

    Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>, IEnumerable<T5>)>
        FetchMultipleAsync<T1, T2, T3, T4, T5>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast);

    /// <summary>
    /// Execute FetchAsync on all online servers
    /// </summary>
    Task<List<int>> ExecuteAsync(IOnlineServerNonQueryCommand command, ExecutionMode mode = ExecutionMode.FailFast);

    /// <summary>
    /// Return Online Server IDs as a comma-separated string
    /// </summary>
    Task<string> GetOnlineServerIds();

    /// <summary>
    /// Return list of online server IDs as models
    /// </summary>
    Task<IEnumerable<SiteDbGroupModel>> GetOnlineServerIdsModel();
}

public class OnlineServerRepositoryImp(IDynamicRepository repository, SiteDbClientService siteDbClientService, LoggingService loggingService)
    : OnlineServerRepository
{
    private readonly OnlineServerRepositoryBaseServiceImp onlineServerBaseService = new(siteDbClientService, loggingService);

    public async Task<IEnumerable<T>> FetchAsync<T>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast)
    {
        var results = await onlineServerBaseService.FetchAsync(criteria,
            async (serverCriteria) => await repository.FetchAsync<T>(serverCriteria), mode);

        return results.SelectMany(x => x);
    }

    public async Task<(IEnumerable<T1>, IEnumerable<T2>)> FetchMultipleAsync<T1, T2>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast)
    {
        var results = await onlineServerBaseService.FetchAsync(criteria,
            async (serverCriteria) => await repository.FetchMultipleAsync<T1, T2>(serverCriteria), mode);

        var item1Results = results.SelectMany(x => x.Item1);
        var item2Results = results.SelectMany(x => x.Item2);

        return (item1Results, item2Results);
    }

    public async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>)> FetchMultipleAsync<T1, T2, T3>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast)
    {
        var results = await onlineServerBaseService.FetchAsync(criteria,
            async (serverCriteria) => await repository.FetchMultipleAsync<T1, T2, T3>(serverCriteria), mode);

        var item1Results = results.SelectMany(x => x.Item1);
        var item2Results = results.SelectMany(x => x.Item2);
        var item3Results = results.SelectMany(x => x.Item3);

        return (item1Results, item2Results, item3Results);
    }

    public async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>)> FetchMultipleAsync<T1, T2, T3, T4>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast)
    {
        var results = await onlineServerBaseService.FetchAsync(criteria,
            async (serverCriteria) => await repository.FetchMultipleAsync<T1, T2, T3, T4>(serverCriteria), mode);

        var item1Results = results.SelectMany(x => x.Item1);
        var item2Results = results.SelectMany(x => x.Item2);
        var item3Results = results.SelectMany(x => x.Item3);
        var item4Results = results.SelectMany(x => x.Item4);

        return (item1Results, item2Results, item3Results, item4Results);
    }

    public async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>, IEnumerable<T5>)>
        FetchMultipleAsync<T1, T2, T3, T4, T5>(IOnlineServerCriteria criteria, ExecutionMode mode = ExecutionMode.FailFast)
    {
        var results = await onlineServerBaseService.FetchAsync(criteria,
            async (serverCriteria) => await repository.FetchMultipleAsync<T1, T2, T3, T4, T5>(serverCriteria), mode);

        var item1Results = results.SelectMany(x => x.Item1);
        var item2Results = results.SelectMany(x => x.Item2);
        var item3Results = results.SelectMany(x => x.Item3);
        var item4Results = results.SelectMany(x => x.Item4);
        var item5Results = results.SelectMany(x => x.Item5);

        return (item1Results, item2Results, item3Results, item4Results, item5Results);
    }

    public async Task<List<int>> ExecuteAsync(IOnlineServerNonQueryCommand command, ExecutionMode mode = ExecutionMode.FailFast)
    {
        return await onlineServerBaseService.ExecuteAsync(command,
            async (serverCommand) => await repository.ExecuteAsync(serverCommand), mode);
    }

    public async Task<string> GetOnlineServerIds()
    {
        return await onlineServerBaseService.GetOnlineServerIds();
    }

    public async Task<IEnumerable<SiteDbGroupModel>> GetOnlineServerIdsModel()
    {
        return await onlineServerBaseService.GetOnlineServerIdsModel();
    }
}