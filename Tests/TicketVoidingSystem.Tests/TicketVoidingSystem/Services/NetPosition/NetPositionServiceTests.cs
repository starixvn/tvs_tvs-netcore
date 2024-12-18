using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.NetPosition;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.NetPosition;

public class NetPositionServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly LoggingService loggingService;
    private readonly IDynamicRepository repository;
    private NetPositionServiceImp service;

    public NetPositionServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        loggingService = Substitute.For<LoggingService>();
        service = new NetPositionServiceImp(loggingService, repository);
    }

    [Fact]
    public async Task UpdateNetPosition_HasTransIds_HasCalledPostRequest()
    {
        // Arrange
        var ticketCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } };

        // Act
        var result = await service.UpdateNetPosition(ticketCrickets, "VOID");

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<TicketVoidingNetPositionCriteria>());
        Assert.True(result);
    }

    [Fact]
    public async Task UpdateNetPosition_TicketCricketsIsAny_ReturnsTrue()
    {
        // Arrange
        var ticketCrickets = new List<BetId>();

        // Act
        var result = await service.UpdateNetPosition(ticketCrickets, "VOID");

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task UpdateNetPosition_WithNullTransIds_ReturnsTrue()
    {
        // Arrange
        // Act
        var result = await service.UpdateNetPosition(null, "VOID");

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task UpdateNetPosition_HasException_ReturnsFalse()
    {
        // Arrange
        service = new NetPositionServiceImp(loggingService, null);
        var ticketCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } };

        // Act
        var result = await service.UpdateNetPosition(ticketCrickets, "VOID");

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task RollBackNetPosition_WithTransIdsIsAny_NotCalledRepositoryExecuteAsync()
    {
        // Arrange
        var ticketCrickets = new List<BetId>();

        // Act
        await service.RollBackNetPosition(ticketCrickets);

        // Assert
        await repository.Received(0).ExecuteAsync(Arg.Any<TicketVoidingNetPositionCriteria>());
    }

    [Fact]
    public async Task RollBackNetPosition_WithTransIdsIsNull_NotCalledRepositoryExecuteAsync()
    {
        // Arrange

        // Act
        await service.RollBackNetPosition(null);

        // Assert
        await repository.Received(0).ExecuteAsync(Arg.Any<TicketVoidingNetPositionCriteria>());
    }

    [Fact]
    public async Task RollBackNetPosition_WithValidTransIds_CalledRepositoryExecuteAsync()
    {
        // Arrange
        var ticketCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } };

        // Act
        await service.RollBackNetPosition(ticketCrickets);

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<TicketVoidingNetPositionCriteria>());
    }
}