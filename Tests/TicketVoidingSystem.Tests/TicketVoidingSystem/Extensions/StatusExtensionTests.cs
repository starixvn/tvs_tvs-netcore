using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions;

public class StatusExtensionTests
{
    [Fact]
    public void IsRunningOrWaiting_StatusIsRunning_ReturnTrue()
    {
        // Arrange
        const string status = TicketStatus.Running;

        // Act
        var result = status.IsRunningOrWaiting();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsRunningOrWaiting_StatusIsWaiting_ReturnTrue()
    {
        // Arrange
        const string status = TicketStatus.Waiting;

        // Act
        var result = status.IsRunningOrWaiting();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsRunningOrWaiting_StatusIsNull_ReturnFalse()
    {
        // Arrange
        // Act
        var result = ((string)null).IsRunningOrWaiting();

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsRunningOrWaiting_StatusIsEmpty_ReturnFalse()
    {
        // Arrange
        const string status = "";

        // Act
        var result = status.IsRunningOrWaiting();

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsRunningOrWaiting_StatusIsNotRunningOrWaiting_ReturnFalse()
    {
        // Arrange
        const string status = TicketStatus.Void;

        // Act
        var result = status.IsRunningOrWaiting();

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsVoided_StatusIsVoid_ReturnTrue()
    {
        // Arrange
        const string status = TicketStatus.Void;

        // Act
        var result = status.IsVoided();

        // Assert
        Assert.True(result);
    }

    [Theory]
    [InlineData(TicketStatus.Sold)]
    [InlineData(TicketStatus.Won)]
    [InlineData(TicketStatus.Draw)]
    public void IsVoided_StatusIsNotVoidCase_ReturnFalse(string status)
    {
        // Act
        var result = status.IsVoided();

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("Running")]
    [InlineData("Waiting")]
    [InlineData("Draw")]
    [InlineData("Won")]
    [InlineData("Lose")]
    public void IsVoided_StatusIsNotVoid_ReturnFalse(string status)
    {
        // Act
        var result = status.IsVoided();

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void SettledStatusContainStatus_ReturnTrue()
    {
        // Arrange
        const string status = TicketStatus.Draw;

        // Act
        var result = status.IsSettled();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsSettled_SettledStatusNotContainStatus_ReturnFalse()
    {
        // Arrange
        const string status = TicketStatus.Waiting;

        // Act
        var result = status.IsSettled();

        // Assert
        Assert.False(result);
    }
}