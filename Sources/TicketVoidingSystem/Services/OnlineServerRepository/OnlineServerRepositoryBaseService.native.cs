using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.SiteDbConnectionManager.Client.Services;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services.OnlineServerRepository;

public class OnlineServerRepositoryBaseServiceImp(SiteDbClientService siteDbClientService, LoggingService loggingService)
{
    internal async Task<string> GetOnlineServerIds()
    {
        var onlineServers = await GetOnlineServer();
        return string.Join(",", onlineServers.Select(x => x.Id));
    }

    internal async Task<IEnumerable<SiteDbGroupModel>> GetOnlineServerIdsModel()
    {
        return await GetOnlineServer();
    }

    internal Task<List<T>> FetchAsync<T>(
        IOnlineServerCriteria criteria,
        Func<IOnlineServerCriteria, Task<T>> repositoryCall,
        ExecutionMode mode)
    {
        return ExecuteInternalAsync(criteria, repositoryCall, mode);
    }

    internal Task<List<T>> ExecuteAsync<T>(
        IOnlineServerNonQueryCommand command,
        Func<IOnlineServerNonQueryCommand, Task<T>> repositoryCall,
        ExecutionMode mode)
    {
        return ExecuteInternalAsync(command, repositoryCall, mode);
    }

    private async Task<List<T>> ExecuteInternalAsync<TInput, T>(
        TInput input,
        Func<TInput, Task<T>> repositoryCall,
        ExecutionMode mode)
        where TInput : ICloneable, ISiteDbGroupAssignable
    {
        return mode is ExecutionMode.FailFast
            ? await FailFast(input, repositoryCall)
            : await ContinueOnError(input, repositoryCall);
    }

    private async Task<List<T>> FailFast<TInput, T>(
        TInput input,
        Func<TInput, Task<T>> repositoryCall)
        where TInput : ICloneable, ISiteDbGroupAssignable
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(server =>
        {
            var cloned = (TInput)input.Clone();
            cloned.SiteDbGroupId = server.Id;
            return repositoryCall(cloned);
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    private async Task<List<T>> ContinueOnError<TInput, T>(
        TInput input,
        Func<TInput, Task<T>> repositoryCall)
        where TInput : ICloneable, ISiteDbGroupAssignable
    {
        var onlineServers = await GetOnlineServer();

        var tasks = onlineServers.Select(async server =>
        {
            try
            {
                var serverCriteria = (TInput)input.Clone();
                serverCriteria.SiteDbGroupId = server.Id;
                return (Success: true, Result: await repositoryCall(serverCriteria));
            }
            catch (Exception e)
            {
                await loggingService.ErrorAsync(e);
                return (Success: false, Result: default);
            }
        });

        var results = await Task.WhenAll(tasks);
        return results.Where(r => r.Success).Select(r => r.Result).ToList();
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