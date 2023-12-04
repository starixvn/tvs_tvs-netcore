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

    [Fact]
    public void StripHtml_WithEmptyHtmlText_ReturnsEmptyString()
    {
        // Arrange
        const string htmlText = "";

        // Act
        var result = htmlText.StripHtml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void StripHtml_WithHtmlText_ReturnsStrippedText()
    {
        // Arrange
        const string htmlText = "<p>This is <strong>bold</strong> text.</p>";
        const string expected = "This is bold text.";

        // Act
        var result = htmlText.StripHtml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void StripHtml_WithHtmlTextContainingEntities_ReturnsDecodedText()
    {
        // Arrange
        const string htmlText = "This is &lt;strong&gt;bold&lt;/strong&gt; text.";
        const string expected = "This is <strong>bold</strong> text.";

        // Act
        var result = htmlText.StripHtml();

        // Assert
        Assert.Equal(expected, result);
    }
}