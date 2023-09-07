using System.Collections.Generic;
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
    public void InsertMessage_ValidData_CacheServiceCalledContainAsync()
    {
        // Arrange

        // Act
        _ = service.IsExistResult("key");

        // Assert
        cacheService.Received(1).ContainAsync("key");
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void GetVoidResultCache_ValidData_CacheServiceCalledTryGetAsync(bool isFound)
    {
        // Arrange
        var results = new List<Result> { new() };
        cacheService.TryGetAsync<IList<Result>>("key").ReturnsForAnyArgs((isFound, results));

        // Act
        _ = service.GetVoidResultsCache("key");

        // Assert
        cacheService.Received(1).TryGetAsync<IList<Result>>("key");
    }

    [Fact]
    public void SetVoidResultCache_ValidData_CacheServiceCalledSetAsync()
    {
        // Arrange
        var results = new List<Result>();

        // Act
        _ = service.SetVoidResultsCache("key", results);

        // Assert
        cacheService.Received(1).SetAsync("key", results, Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public void GetSimpleResultCache_HasFound_ReturnResult()
    {
        // Arrange
        var expected = new Result();
        cacheService.TryGetAsync<Result>("1").ReturnsForAnyArgs((true, expected));

        // Act
        var actual = service.GetSimpleResultCache("1");

        // Assert
        AssertExtension.Equal(actual.Result, expected);
    }

    [Fact]
    public void GetSimpleResultCache_NotFound_ReturnNull()
    {
        // Arrange
        var expected = new Result();
        cacheService.TryGetAsync<Result>("1").ReturnsForAnyArgs((false, expected));

        // Act
        var actual = service.GetSimpleResultCache("1");

        // Assert
        Assert.Null(actual.Result);
    }

    [Fact]
    public void SetSimpleResultCache_ValidData_ReturnExpected()
    {
        // Arrange
        var result = new Result();

        // Act
        _ = service.SetSimpleResultCache("1", result);

        // Assert
        cacheService.Received(1).SetAsync("1", result, Arg.Any<CacheItemOptions>());
    }
}