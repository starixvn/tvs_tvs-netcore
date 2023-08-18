using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions;

public class IssueTypeExtensionTests
{
    [Fact]
    public void IsDangerAccepted_ReturnsTrue()
    {
        // Arrange
        // Act
        var result = 1.IsDangerAccepted();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsDangerAccepted_ReturnsFalse()
    {
        // Arrange
        // Act
        var result = 2.IsDangerAccepted();

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsRedCard_ReturnsTrue()
    {
        // Arrange
        // Act
        var result = 10.IsRedCard();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsRedCard_ReturnsFalse()
    {
        // Arrange
        // Act
        var result = 2.IsRedCard();

        // Assert
        Assert.False(result);
    }


    [Fact]
    public void IsWrongScore_ReturnsTrue()
    {
        // Arrange
        // Act
        var result = 3.IsWrongScore();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsWrongScore_ReturnsFalse()
    {
        // Arrange
        // Act
        var result = 2.IsWrongScore();

        // Assert
        Assert.False(result);
    }
}