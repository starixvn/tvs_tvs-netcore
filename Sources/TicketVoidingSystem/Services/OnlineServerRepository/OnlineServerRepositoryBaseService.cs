using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.SiteDbConnectionManager.Client.Services;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services.OnlineServerRepository;

public interface OnlineServerRepositoryBaseService
{
    /// <summary>
    /// Execute repository call on all online servers and return combined results for multiple types
    /// </summary>
#pragma warning disable S2436

    Task<List<(T1, T2, T3, T4, T5)>> ExecuteAsync<T1, T2, T3, T4, T5>(
#pragma warning restore S2436
        IOnlineServerCriteria criteria,
        Func<IOnlineServerCriteria, Task<(T1, T2, T3, T4, T5)>> repositoryCall);

    /// <summary>
    /// Execute repository call on all online servers and return combined results for multiple types
    /// </summary>
#pragma warning disable S2436

    Task<List<(T1, T2, T3, T4)>> ExecuteAsync<T1, T2, T3, T4>(
#pragma warning restore S2436
        IOnlineServerCriteria criteria,
        Func<IOnlineServerCriteria, Task<(T1, T2, T3, T4)>> repositoryCall);

    /// <summary>
    /// Execute repository call on all online servers and return combined results for multiple types
    /// </summary>
    Task<List<(T1, T2, T3)>> ExecuteAsync<T1, T2, T3>(
        IOnlineServerCriteria criteria,
        Func<IOnlineServerCriteria, Task<(T1, T2, T3)>> repositoryCall);

    /// <summary>
    /// Execute repository call on all online servers and return combined results for multiple types
    /// </summary>
    Task<List<(T1, T2)>> ExecuteAsync<T1, T2>(
        IOnlineServerCriteria criteria,
        Func<IOnlineServerCriteria, Task<(T1, T2)>> repositoryCall);

    /// <summary>
    /// Execute repository call on all online servers and return combined results
    /// </summary>
    Task<List<T>> ExecuteAsync<T>(IOnlineServerCriteria criteria, Func<IOnlineServerCriteria, Task<T>> repositoryCall);

    /// <summary>
    /// Execute repository call on all online servers and return combined results
    /// </summary>
    Task<List<T>> ExecuteAsync<T>(IOnlineServerNonQueryCommand criteria, Func<IOnlineServerNonQueryCommand, Task<T>> repositoryCall);

    /// <summary>
    /// Return Online Server IDs as a comma-separated string
    /// </summary>
    Task<string> GetOnlineServerIds();

    /// <summary>
    /// Return list of online server IDs as models
    /// </summary>
    Task<IEnumerable<SiteDbGroupModel>> GetOnlineServerIdsModel();
}

public class OnlineServerRepositoryBaseServiceImp(SiteDbClientService siteDbClientService)
    : OnlineServerRepositoryBaseService
{
#pragma warning disable S2436

    public async Task<List<(T1, T2, T3, T4, T5)>> ExecuteAsync<T1, T2, T3, T4, T5>(
#pragma warning restore S2436
        IOnlineServerCriteria criteria,
        Func<IOnlineServerCriteria, Task<(T1, T2, T3, T4, T5)>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = (IOnlineServerCriteria)criteria.Clone();
            serverCriteria.SiteDbGroupId = server.Id;
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

#pragma warning disable S2436

    public async Task<List<(T1, T2, T3, T4)>> ExecuteAsync<T1, T2, T3, T4>(
#pragma warning restore S2436
        IOnlineServerCriteria criteria,
        Func<IOnlineServerCriteria, Task<(T1, T2, T3, T4)>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = (IOnlineServerCriteria)criteria.Clone();
            serverCriteria.SiteDbGroupId = server.Id;
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    public async Task<List<(T1, T2, T3)>> ExecuteAsync<T1, T2, T3>(
        IOnlineServerCriteria criteria,
        Func<IOnlineServerCriteria, Task<(T1, T2, T3)>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = (IOnlineServerCriteria)criteria.Clone();
            serverCriteria.SiteDbGroupId = server.Id;
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    public async Task<List<(T1, T2)>> ExecuteAsync<T1, T2>(
        IOnlineServerCriteria criteria,
        Func<IOnlineServerCriteria, Task<(T1, T2)>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = (IOnlineServerCriteria)criteria.Clone();
            serverCriteria.SiteDbGroupId = server.Id;
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    public async Task<List<T>> ExecuteAsync<T>(IOnlineServerCriteria criteria, Func<IOnlineServerCriteria, Task<T>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = (IOnlineServerCriteria)criteria.Clone();
            serverCriteria.SiteDbGroupId = server.Id;
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    public async Task<List<T>> ExecuteAsync<T>(IOnlineServerNonQueryCommand criteria, Func<IOnlineServerNonQueryCommand, Task<T>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = (IOnlineServerNonQueryCommand)criteria.Clone();
            serverCriteria.SiteDbGroupId = server.Id;
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    public async Task<string> GetOnlineServerIds()
    {
        var onlineServers = await GetOnlineServer();
        return string.Join(",", onlineServers.Select(x => x.Id));
    }

    public async Task<IEnumerable<SiteDbGroupModel>> GetOnlineServerIdsModel()
    {
        return await GetOnlineServer();
    }

    private async Task<List<SiteDbGroupModel>> GetOnlineServer()
    {
        var onlineServer = await siteDbClientService.GetActiveSiteDbAsync();
        var ignoreSiteDbList = !string.IsNullOrWhiteSpace(AppSettingService.AppSetting?.IgnoreSiteDb)
            ? AppSettingService.AppSetting.IgnoreSiteDb.Split(',').Select(int.Parse)
            : new List<int>();

        return onlineServer.Where(site => ignoreSiteDbList.All(y => y != site.SiteDbGroupId))
            .Select(x => new SiteDbGroupModel
            {
                Id = x.SiteDbGroupId,
                IsOnline = x.Status,
                ServerName = SiteDbGroupConstant.AllSiteDb.Find(y => y.Id == x.SiteDbGroupId)?.ServerName
            }).ToList();
    }
}