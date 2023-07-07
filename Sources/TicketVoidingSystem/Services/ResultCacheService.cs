using System;
using System.Threading.Tasks;
using Fanex.Caching;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services;

public interface ResultCacheService
{
    Task<bool> IsExistResult(string key);

    Task<Result> GetResultCache(string key);

    Task SetResultCache(string key, Result result);
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

    public async Task<Result> GetResultCache(string key)
    {
        var (isFound, result) = await cacheService.TryGetAsync<Result>(key);
        return isFound ? result : null;
    }

    public async Task SetResultCache(string key, Result result)
    {
        var cachePolicy = new CacheItemOptions().SetSlidingExpiration(TimeSpan.FromHours(1));
        await cacheService.SetAsync(key, result, cachePolicy);
    }
}