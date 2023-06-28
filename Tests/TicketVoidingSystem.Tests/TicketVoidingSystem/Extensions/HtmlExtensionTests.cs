using HtmlAgilityPack;
using NSubstitute;
using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.Extensions;

public class HtmlExtensionTests
{
    [Fact]
    public void DefaultText_HtmlIsNull_ReturnsEmptyString()
    {
        // Arrange
        string html = null;

        // Act
        string result = html.DefaultText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void DefaultText_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        string html = string.Empty;

        // Act
        string result = html.DefaultText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void DefaultText_HtmlIsNotEmpty_ReturnsInnerText()
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
    public void StakeText_HtmlIsNull_ReturnsEmptyString()
    {
        // Arrange
        string html = null;

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void StakeText_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        string html = string.Empty;

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void StakeText_HtmlHasStakeClass_ReturnsInnerTextOfStake()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00", result);
    }

    [Fact]
    public void StakeText_HtmlContainsOriginalStake_ReturnsStakeOriginalStake()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='originalStake'>(+5.00)</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("(+5.00)\r\n10.00", result);
    }

    [Fact]
    public void StakeText_HtmlContainsLightBlue_ReturnsStakeLightBlue()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='light-blue'>(+5.00)</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00\r\n(+5.00)", result);
    }

    [Fact]
    public void StakeText_HtmlContainsRebateBonusClass_ReturnsStakeWithRebateBonus()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='rebate-bonus'>+5.00</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00\r\n(+5.00)", result);
    }

    [Fact]
    public void StakeText_HtmlContainsNPHPromotionClass_ReturnsStakeWithNPHPromotion()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='nph-promotion'>(+2.50)</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00\r\n((+2.50))", result);
    }

    [Fact]
    public void StakeText_HtmlContainsReturnStake_ReturnsStakeReturnStake()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><div class='return-stake'>(+5.00)</div><div class='discount'>7.00</div>";

        // Act
        string result = html.StakeText();

        // Assert
        Assert.Equal("10.00\r\n(+5.00)\r\n7.00", result);
    }


    [Fact]
    public void LineBreak_HtmlIsNull_ReturnsEmptyString()
    {
        // Arrange
        string html = null;

        // Act
        string result = html.LineBreak();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void LineBreak_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        string html = string.Empty;

        // Act
        string result = html.LineBreak();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void LineBreak_HtmlNotNull_ReturnsExpected()
    {
        // Arrange
        string html = "<div class='stake'>10.00</div><br><div class='return-stake'>(+5.00)";
        string expected = "10.00\r\n(+5.00)";
        // Act
        string result = html.LineBreak();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void Handicap_HtmlIsNull_ReturnEmptyString()
    {
        // Arrange
        string html = null;
        var doc = Substitute.For<HtmlDocument>();

        // Act
        string result = html.Handicap(doc);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void Handicap_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        string html = string.Empty;
        var doc = Substitute.For<HtmlDocument>();
        doc.LoadHtml(html);

        // Act
        var result = html.Handicap(doc);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlIsNull_ReturnsEmptyString()
    {
        // Arrange
        string html = null;
        bool isParlay = true;

        // Act
        string result = html.ChoiceSubParlay(isParlay);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        string html = string.Empty;
        bool isParlay = true;

        // Act
        string result = html.ChoiceSubParlay(isParlay);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlHasFferNameIsNull_ReturnsChoice()
    {
        // Arrange
        string html = "<div class='match'>10.00</div><br><div class='league'>(+5.00)</ div ><br><div class='bettype'><a>Choice 1</a><br>><span>Handicap 1</span>(+5.00)</ div >";
        bool isParlay = true;
        var exxpected = "Choice 1\nHandicap 1\nChoice 1>Handicap 1(+5.00)\n10.00\n(+5.00)Choice 1>Handicap 1(+5.00)";

        // Act
        string result = html.ChoiceSubParlay(isParlay);

        // Assert
        Assert.Equal(exxpected, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlHasFferNameIsNotNull_ReturnsOfferNameList()
    {
        // Arrange
        string html = "<div class='match'>10.00</div><br><div class='league'>(+5.00)</ div ><br><div class='offer-name-list'><div class='bettype'><a>Choice 1</a><br>><span>Handicap 1</span>(+5.00)</ div ></ div >";
        bool isParlay = true;
        var exxpected = "Choice 1\nChoice 1>Handicap 1(+5.00)\nHandicap 1\nChoice 1>Handicap 1(+5.00)\n10.00\n(+5.00)Choice 1>Handicap 1(+5.00)";

        // Act
        string result = html.ChoiceSubParlay(isParlay);

        // Assert
        Assert.Equal(exxpected, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlContainsExcludingChoices_ReturnsHasSecondLine()
    {
        // Arrange
        string html = "<div class='match'>10.00</div><br><div class='league'>(+5.00)</ div ><div class='bettype'>Bettype 1</ div ><br><div class='offer-name-list'><div class='excluding-choices'><a>Choice 1</a><br>><span>Handicap 1<br>Handicap 2</span></ div ></ div >";
        bool isParlay = false;
        var exxpected = "Handicap 1\nChoice 1>Handicap 1Handicap 2\nBettype 1Choice 1>Handicap 1Handicap 2\n10.00\n(+5.00)Bettype 1Choice 1>Handicap 1Handicap 2";

        // Act
        string result = html.ChoiceSubParlay(isParlay);

        // Assert
        Assert.Equal(exxpected, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlContainsCashOutFromNo_ReturnsHasSecondLine()
    {
        // Arrange
        string html = "<div class='match'>10.00</div><br><div class='league'>(+5.00)</ div ><div class='bettype'><div class='bettype-description'>Bettype 1</ div ></ div ><br><div class='offer-name-list'><div class='Cash Out from No'><a>Choice 1</a><br>><span>Handicap 1<br>Handicap 2</span></ div ></ div >";
        bool isParlay = false;
        var exxpected = "Handicap 1\nHandicap 2\nBettype 1Choice 1>Handicap 1Handicap 2\nBettype 1Choice 1>Handicap 1Handicap 2\n10.00\n(+5.00)Bettype 1Choice 1>Handicap 1Handicap 2";

        // Act
        string result = html.ChoiceSubParlay(isParlay);

        // Assert
        Assert.Equal(exxpected, result);
    }

    [Fact]
    public void ChoiceShortSubParlay_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        string html = string.Empty;

        // Act
        string result = html.ChoiceShortSubParlay(true);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    
}

