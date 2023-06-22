using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.Extensions;

public class HtmlExtensionTests
{
    [Fact]
    public void DefaultText_ReturnsEmptyString_WhenHtmlIsNull()
    {
        // Arrange
        string html = null;

        // Act
        string result = html.DefaultText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void DefaultText_ReturnsEmptyString_WhenHtmlIsEmpty()
    {
        // Arrange
        string html = string.Empty;

        // Act
        string result = html.DefaultText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void DefaultText_ReturnsInnerText_WhenHtmlIsNotEmpty()
    {
        // Arrange
        string html = "<div>This is the <strong>inner text</strong> of the HTML.</div>";

        // Act
        string result = html.DefaultText();

        // Assert
        Assert.Equal("This is the inner text of the HTML.", result);
    }


    // Add more test cases for the DefaultText method

    [Fact]
    public void StakeText_ReturnsEmptyString_WhenHtmlIsNull()
    {
        // Arrange
        string html = null;

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void StakeText_ReturnsEmptyString_WhenHtmlIsEmpty()
    {
        // Arrange
        string html = string.Empty;

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void StakeText_ReturnsInnerTextOfStake_WhenHtmlHasStakeClass()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00", result);
    }

    [Fact]
    public void StakeText_ReturnsStakeOriginalStake_WhenHtmlContainsOriginalStake()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='originalStake'>(+5.00)</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("(+5.00)\r\n10.00", result);
    }

    [Fact]
    public void StakeText_ReturnsStakeLightBlue_WhenHtmlContainsLightBlue()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='light-blue'>(+5.00)</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00\r\n(+5.00)", result);
    }

    [Fact]
    public void StakeText_ReturnsStakeWithRebateBonus_WhenHtmlContainsRebateBonusClass()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='rebate-bonus'>+5.00</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00\r\n(+5.00)", result);
    }

    [Fact]
    public void StakeText_ReturnsStakeWithNPHPromotion_WhenHtmlContainsNPHPromotionClass()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='nph-promotion'>(+2.50)</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00\r\n((+2.50))", result);
    }

    [Fact]
    public void StakeText_ReturnsStakeReturnStake_WhenHtmlContainsReturnStake()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='return-stake'>(+5.00)</div><div class='discount'>7.00</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00\r\n(+5.00)\r\n7.00", result);
    }


    [Fact]
    public void LineBreak_ReturnsEmptyString_WhenHtmlIsNull()
    {
        // Arrange
        string html = null;

        // Act
        string result = html.LineBreak();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void LineBreak_ReturnsEmptyString_WhenHtmlIsEmpty()
    {
        // Arrange
        string html = string.Empty;

        // Act
        string result = html.LineBreak();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void LineBreak_ReturnsExpected_WhenHtmlNotNull()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><br><div class='return-stake'>(+5.00)";
        string expected = "10.00\r\n(+5.00)";
        // Act
        string result = html.LineBreak();

        // Assert
        Assert.Equal(expected, result);
    }

    // [Fact]
    // public void Handicap_ReturnsEmptyString_WhenHtmlIsNull()
    // {
    //     // Arrange
    //     string html = null;

    //     // Act
    //     var result = html.Handicap(new HtmlDocument());

    //     // Assert
    //     Assert.Equal(string.Empty, result);
    // }

    // [Fact]
    // public void Handicap_ReturnsEmptyString_WhenHtmlIsEmpty()
    // {
    //     // Arrange
    //     string html = string.Empty;
    //     var doc = new HtmlDocument();
    //     doc.LoadHtml(html);

    //     // Act
    //     var result = html.Handicap(doc);

    //     // Assert
    //     Assert.Equal(string.Empty, result);
    // }

    // [Fact]
    // public void ChoiceSubParlay_ReturnsEmptyString_WhenHtmlIsNull()
    // {
    //     // Arrange
    //     string html = null;
    //     bool isParlay = true;

    //     // Act
    //     string result = html.ChoiceSubParlay(isParlay);

    //     // Assert
    //     Assert.Equal(string.Empty, result);
    // }

    // [Fact]
    // public void ChoiceSubParlay_ReturnsEmptyString_WhenHtmlIsEmpty()
    // {
    //     // Arrange
    //     string html = string.Empty;
    //     bool isParlay = true;

    //     // Act
    //     string result = html.ChoiceSubParlay(isParlay);

    //     // Assert
    //     Assert.Equal(string.Empty, result);
    // }

    // [Fact]
    // public void GetBetTypeDescription_ReturnsEmptyString_WhenDescriptionListIsNull()
    // {
    //     // Arrange
    //     var doc = Substitute.For<HtmlDocument>();
    //     doc.DocumentNode.SelectNodes("//div[@class='bettype-description']").Returns((HtmlNodeCollection)null);

    //     // Act
    //     string result = HtmlExtension.GetBetTypeDescription(doc);

    //     // Assert
    //     Assert.Equal(string.Empty, result);
    // }

    // [Fact]
    // public void GetBetTypeDescription_ReturnsConcatenatedDescriptions_WhenDescriptionListIsNotEmpty()
    // {
    //     // Arrange
    //     var doc = Substitute.For<HtmlDocument>();

    //     // Configure the HtmlDocument to return the desired description nodes
    //     var descriptionNode1 = Substitute.For<HtmlNode>();
    //     descriptionNode1.InnerHtml.Returns("<p>Description 1</p>");
    //     var descriptionNode2 = Substitute.For<HtmlNode>();
    //     descriptionNode2.InnerHtml.Returns("<p>Description 2</p>");
    //     var descriptionNode3 = Substitute.For<HtmlNode>();
    //     descriptionNode3.InnerHtml.Returns("<p>Description 3</p>");
    //     doc.DocumentNode.SelectNodes("//div[@class='bettype-description']")
    //         .Returns(new HtmlNodeCollection(doc) { descriptionNode1, descriptionNode2, descriptionNode3 });

    //     // Act
    //     string result = HtmlExtension.GetBetTypeDescription(doc);

    //     // Assert
    //     Assert.Equal("Description 1\r\nDescription 2\r\nDescription 3", result);
    // }
}

