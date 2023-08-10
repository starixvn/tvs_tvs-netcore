using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Caching;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services;

public interface ResultCacheService
{
    Task<bool> IsExistResult(string key);

    Task<Result> GetSimpleResultCache(string key);

    Task SetSimpleResultCache(string key, Result result);

    Task<IList<Result>> GetVoidResultsCache(string key);

    Task SetVoidResultsCache(string key, IList<Result> results);
}

public class ResultCacheServiceImp : ResultCacheService
{
    private readonly ICache cacheService;

    public ResultCacheServiceImp(ICache cacheService)
    {
        this.cacheService = cacheService;
    }

    public async Task<bool> IsExistResult(string key)
    {
        return await cacheService.ContainAsync(key);
    }

    public async Task<Result> GetSimpleResultCache(string key)
    {
        var (isFound, result) = await cacheService.TryGetAsync<Result>(key);
        return isFound ? result : null;
    }

    public async Task SetSimpleResultCache(string key, Result result)
    {
        await SetResultsCache(key, result);
    }

    public async Task<IList<Result>> GetVoidResultsCache(string key)
    {
        var (isFound, results) = await cacheService.TryGetAsync<IList<Result>>(key);
        return isFound ? results.ToList() : null;
    }

    public async Task SetVoidResultsCache(string key, IList<Result> results)
    {
        await SetResultsCache(key, results);
    }

    private async Task SetResultsCache(string key, object results)
    {
        var cachePolicy = new CacheItemOptions().SetSlidingExpiration(TimeSpan.FromHours(1));
        await cacheService.SetAsync(key, results, cachePolicy);
    }
}