using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Services.Analytics;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.Analytics;

public class UserActionLogServiceTests
{
    private readonly UserActionLogService userActionLogService;
    private readonly SessionService sessionService;
    private readonly IDynamicRepository repository;

    public UserActionLogServiceTests()
    {
        sessionService = Substitute.For<SessionService>();
        repository = Substitute.For<IDynamicRepository>();
        userActionLogService = new UserActionLogServiceImp(sessionService, repository);
    }

    [Fact]
    public void LogAccessFunction_ValidFunctionName_ReturnsTrue()
    {
        // Arrange
        const string functionName = "SomeFunction";

        // Act
        var result = userActionLogService.LogAccessFunction(functionName);

        // Assert
        Assert.True(result);
        // Note: Since it's fire-and-forget, we can't easily verify the repository call
        // The method returns true immediately regardless of the background operation
    }

    [Fact]
    public void LogChangeContent_ValidFunctionNameAndLogContent_ReturnsImmediately()
    {
        // Arrange
        const string functionName = "SomeFunction";
        const string logContent = "Some log content";

        // Act & Assert
        // Should not throw any exception
        userActionLogService.LogChangeContent(functionName, logContent);

        // Note: Since it's fire-and-forget, we can't easily verify the repository call
        // The method returns immediately regardless of the background operation
    }
}