using System;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Criteria.Analytics;
using TicketVoidingSystem.SharedApi.Services.Analytics;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.Analytics;

public class UserActionLogServiceTests
{
    private readonly UserActionLogService userActionLogService;
    private readonly SessionService sessionService;
    private readonly IDynamicRepository repository;
    private readonly LoggingService loggingService;

    public UserActionLogServiceTests()
    {
        sessionService = Substitute.For<SessionService>();
        repository = Substitute.For<IDynamicRepository>();
        loggingService = Substitute.For<LoggingService>();
        userActionLogService = new UserActionLogServiceImp(sessionService, repository, loggingService);
    }

    [Fact]
    public async Task LogAccessFunction_ValidFunctionName_ReturnsTrue()
    {
        // Arrange
        var functionName = "SomeFunction";

        // Act
        var result = await userActionLogService.LogAccessFunction(functionName);

        // Assert
        Assert.True(result);
        await repository.Received(1).ExecuteAsync(Arg.Is<UserActionLogUpdateCriteria>(criteria =>
            criteria.IsActionCount &&
            criteria.UserId == sessionService.UserId &&
            criteria.FunctionName == functionName));
    }

    [Fact]
    public async Task LogAccessFunction_ExceptionThrown_ReturnsFalse()
    {
        // Arrange
        var functionName = "SomeFunction";
        var exception = new Exception("Test Exception");
        repository.When(x => x.ExecuteAsync(Arg.Any<UserActionLogUpdateCriteria>())).Throw(exception);

        // Act
        var result = await userActionLogService.LogAccessFunction(functionName);

        // Assert
        Assert.False(result);
        await loggingService.Received(1).ErrorAsync(nameof(UserActionLogServiceImp.LogAccessFunction), exception);
    }

    [Fact]
    public async Task LogChangeContent_ValidFunctionNameAndLogContent_ReturnsTrue()
    {
        // Arrange
        var functionName = "SomeFunction";
        var logContent = "Some log content";

        // Act
        var result = await userActionLogService.LogChangeContent(functionName, logContent);

        // Assert
        Assert.True(result);
        await repository.Received(1).ExecuteAsync(Arg.Is<UserActionLogUpdateCriteria>(criteria =>
            !criteria.IsActionCount &&
            criteria.UserId == sessionService.UserId &&
            criteria.FunctionName == functionName &&
            criteria.LogContent == logContent));
    }

    [Fact]
    public async Task LogChangeContent_ExceptionThrown_ReturnsFalse()
    {
        // Arrange
        var functionName = "SomeFunction";
        var logContent = "Some log content";
        var exception = new Exception("Test Exception");
        repository.When(x => x.ExecuteAsync(Arg.Any<UserActionLogUpdateCriteria>())).Throw(exception);

        // Act
        var result = await userActionLogService.LogChangeContent(functionName, logContent);

        // Assert
        Assert.False(result);
        await loggingService.Received(1).ErrorAsync(nameof(UserActionLogServiceImp.LogChangeContent), exception);
    }
}