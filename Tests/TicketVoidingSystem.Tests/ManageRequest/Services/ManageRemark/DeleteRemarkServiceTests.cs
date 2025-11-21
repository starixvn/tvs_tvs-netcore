using System;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark;

public class DeleteRemarkServiceTests
{
    private readonly SessionService sessionService;
    private readonly IDynamicRepository repository;
    private readonly LoggingService loggingService;
    private readonly DeleteRemarkServiceImp service;

    public DeleteRemarkServiceTests()
    {
        sessionService = Substitute.For<SessionService>();
        repository = Substitute.For<IDynamicRepository>();
        loggingService = Substitute.For<LoggingService>();
        service = new DeleteRemarkServiceImp(sessionService, repository, loggingService);
    }

    [Fact]
    public async Task Execute_ValidRemarkId_ReturnSuccessResult()
    {
        // Arrange
        var remarkId = 1;
        var userId = 100;
        var ip = "127.0.0.1";
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        var actual = await service.Execute(remarkId);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(0, actual.ErrorCode);
        Assert.Equal("Success", actual.ErrorMsg);
        await repository.Received().ExecuteAsync(Arg.Is<DeleteRemarkCommand>(c =>
            c.RemarkId == remarkId && c.UserId == userId && c.IP == ip));
    }

    [Fact]
    public async Task Execute_ExceptionOccurred_ReturnErrorResult()
    {
        // Arrange
        var remarkId = 999;
        var exception = new Exception("Delete failed");
        repository.ExecuteAsync(Arg.Any<DeleteRemarkCommand>())
            .Returns(Task.FromException<int>(exception));

        // Act
        var actual = await service.Execute(remarkId);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(1, actual.ErrorCode);
        Assert.Equal("Delete failed", actual.ErrorMsg);
        await loggingService.Received().ErrorAsync(exception);
    }

    [Fact]
    public async Task Execute_CommandHasCorrectRemarkId_SetCorrectly()
    {
        // Arrange
        var remarkId = 123;
        var userId = 100;
        var ip = "127.0.0.1";
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        _ = await service.Execute(remarkId);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Is<DeleteRemarkCommand>(c => c.RemarkId == remarkId));
    }

    [Fact]
    public async Task Execute_ValidRemarkId_DataIsNull()
    {
        // Arrange
        var remarkId = 1;
        var userId = 100;
        var ip = "127.0.0.1";
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        var actual = await service.Execute(remarkId);

        // Assert
        Assert.NotNull(actual);
        Assert.Null(actual.Data);
    }

    [Fact]
    public async Task Execute_ZeroRemarkId_StillProcesses()
    {
        // Arrange
        var remarkId = 0;
        var userId = 100;
        var ip = "127.0.0.1";
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        var actual = await service.Execute(remarkId);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(0, actual.ErrorCode);
        await repository.Received().ExecuteAsync(Arg.Is<DeleteRemarkCommand>(c => c.RemarkId == remarkId));
    }
}