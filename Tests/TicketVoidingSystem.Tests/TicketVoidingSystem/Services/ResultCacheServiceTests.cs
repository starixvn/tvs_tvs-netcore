using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Caching;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services;

public class ResultCacheServiceTests
{
    private readonly ICache cacheService;
    private readonly ResultCacheServiceImp service;

    public ResultCacheServiceTests()
    {
        cacheService = Substitute.For<ICache>();
        service = new ResultCacheServiceImp(cacheService);
    }

    [Fact]
    public async Task InsertMessage_ValidData_CacheServiceCalledContainAsync()
    {
        // Arrange

        // Act
        _ = await service.IsExistResult("key");

        // Assert
        await cacheService.Received(1).ContainAsync("key");
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task GetVoidResultCache_ValidData_CacheServiceCalledTryGetAsync(bool isFound)
    {
        // Arrange
        var results = new List<Result> { new() };
        cacheService.TryGetAsync<IList<Result>>("key").ReturnsForAnyArgs((isFound, results));

        // Act
        _ = await service.GetVoidResultsCache("key");

        // Assert
        await cacheService.Received(1).TryGetAsync<IList<Result>>("key");
    }

    [Fact]
    public async Task SetVoidResultCache_ValidData_CacheServiceCalledSetAsync()
    {
        // Arrange
        var results = new List<Result>();

        // Act
        await service.SetVoidResultsCache("key", results);

        // Assert
        await cacheService.Received(1).SetAsync("key", results, Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetSimpleResultCache_HasFound_ReturnResult()
    {
        // Arrange
        var expected = new Result();
        cacheService.TryGetAsync<Result>("1").ReturnsForAnyArgs((true, expected));

        // Act
        var actual = await service.GetSimpleResultCache("1");

        // Assert
        AssertExtension.Equal(actual, expected);
    }

    [Fact]
    public async Task GetSimpleResultCache_NotFound_ReturnNull()
    {
        // Arrange
        var expected = new Result();
        cacheService.TryGetAsync<Result>("1").ReturnsForAnyArgs((false, expected));

        // Act
        var actual = await service.GetSimpleResultCache("1");

        // Assert
        Assert.Null(actual);
    }

    [Fact]
    public async Task SetSimpleResultCache_ValidData_ReturnExpected()
    {
        // Arrange
        var result = new Result();

        // Act
        await service.SetSimpleResultCache("1", result);

        // Assert
        await cacheService.Received(1).SetAsync("1", result, Arg.Any<CacheItemOptions>());
    }
}