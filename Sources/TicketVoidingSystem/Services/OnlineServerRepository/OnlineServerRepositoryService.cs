using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.SiteDbConnectionManager.Client.Services;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services.OnlineServerRepository;

public interface OnlineServerRepositoryService
{
    /// <summary>
    /// Execute repository call on all online servers and return combined results
    /// </summary>
    Task<List<T>> ExecuteAsync<T>(object criteria, Func<object, Task<T>> repositoryCall);

    /// <summary>
    /// Execute repository call on all online servers and return combined results for multiple types
    /// </summary>
#pragma warning disable S2436

    Task<List<(T1, T2, T3, T4, T5)>> ExecuteAsync<T1, T2, T3, T4, T5>(
#pragma warning restore S2436
        object criteria,
        Func<object, Task<(T1, T2, T3, T4, T5)>> repositoryCall);

    /// <summary>
    /// Execute repository call on all online servers and return combined results for multiple types
    /// </summary>
#pragma warning disable S2436

    Task<List<(T1, T2, T3, T4)>> ExecuteAsync<T1, T2, T3, T4>(
#pragma warning restore S2436
        object criteria,
        Func<object, Task<(T1, T2, T3, T4)>> repositoryCall);

    /// <summary>
    /// Execute repository call on all online servers and return combined results for multiple types
    /// </summary>
    Task<List<(T1, T2, T3)>> ExecuteAsync<T1, T2, T3>(
        object criteria,
        Func<object, Task<(T1, T2, T3)>> repositoryCall);

    /// <summary>
    /// Execute repository call on all online servers and return combined results for multiple types
    /// </summary>
    Task<List<(T1, T2)>> ExecuteAsync<T1, T2>(
        object criteria,
        Func<object, Task<(T1, T2)>> repositoryCall);

    /// <summary>
    /// Return Online Server IDs as a comma-separated string
    /// </summary>
    Task<string> GetOnlineServerIds();
}

public class OnlineServerRepositoryServiceImp(SiteDbClientService siteDbClientService)
    : OnlineServerRepositoryService
{
    public async Task<List<T>> ExecuteAsync<T>(object criteria, Func<object, Task<T>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = CloneCriteria(criteria);
            SetServerId(serverCriteria, server.Id);
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

#pragma warning disable S2436

    public async Task<List<(T1, T2, T3, T4, T5)>> ExecuteAsync<T1, T2, T3, T4, T5>(
#pragma warning restore S2436
        object criteria,
        Func<object, Task<(T1, T2, T3, T4, T5)>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = CloneCriteria(criteria);
            SetServerId(serverCriteria, server.Id);
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

#pragma warning disable S2436

    public async Task<List<(T1, T2, T3, T4)>> ExecuteAsync<T1, T2, T3, T4>(
#pragma warning restore S2436
        object criteria,
        Func<object, Task<(T1, T2, T3, T4)>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = CloneCriteria(criteria);
            SetServerId(serverCriteria, server.Id);
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    public async Task<List<(T1, T2, T3)>> ExecuteAsync<T1, T2, T3>(
        object criteria,
        Func<object, Task<(T1, T2, T3)>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = CloneCriteria(criteria);
            SetServerId(serverCriteria, server.Id);
            return repositoryCall(serverCriteria);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    public async Task<List<(T1, T2)>> ExecuteAsync<T1, T2>(
        object criteria,
        Func<object, Task<(T1, T2)>> repositoryCall)
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var serverCriteria = CloneCriteria(criteria);
            SetServerId(serverCriteria, server.Id);
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

    private static object CloneCriteria(object criteria)
    {
        if (criteria is ICloneable cloneable)
        {
            return cloneable.Clone();
        }

        return criteria;
    }

    private static void SetServerId(object criteria, int serverId)
    {
        var property = criteria.GetType().GetProperty("SiteDbGroupId");
        if (property != null && property.CanWrite)
        {
            property.SetValue(criteria, serverId);
        }
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