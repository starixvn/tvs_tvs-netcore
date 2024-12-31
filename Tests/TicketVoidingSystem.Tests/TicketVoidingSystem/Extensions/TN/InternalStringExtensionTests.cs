using TicketVoidingSystem.Extensions.TN;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions.TN;

public class InternalStringExtensionTests
{
    [Fact]
    public void DistinctWithComma_WithNullOrEmptyText_ReturnsEmptyString()
    {
        // Arrange
        // Act
        var result = ((string)null).DistinctWithComma();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void DistinctWithComma_WithValidText_ReturnsDistinctStringWithComma()
    {
        // Arrange
        const string text = "User1,User2,User1,User3,User2";
        const string expected = "User1,User2,User3";

        // Act
        var result = text.DistinctWithComma();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void DistinctWithComma_WithTextContainingEmptySpaces_ReturnsDistinctStringWithComma()
    {
        // Arrange
        const string text = "User1,User2,,User3";
        const string expected = "User1,User2,User3";

        // Act
        var result = text.DistinctWithComma();

        // Assert
        Assert.Equal(expected, result);
    }
}