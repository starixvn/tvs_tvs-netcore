using System;
using HtmlAgilityPack;
using NSubstitute;
using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions;

public class HtmlExtensionTests
{
    [Fact]
    public void DefaultText_HtmlIsNull_ReturnsEmptyString()
    {
        // Arrange
        // Act
        var result = ((string)null).DefaultText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void DefaultText_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        var html = string.Empty;

        // Act
        var result = html.DefaultText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void DefaultText_HtmlIsNotEmpty_ReturnsInnerText()
    {
        // Arrange
        const string html = "<div>This is the <strong>inner text</strong> of the HTML.</div>";

        // Act
        var result = html.DefaultText();

        // Assert
        Assert.Equal("This is the inner text of the HTML.", result);
    }

    [Fact]
    public void StakeText_HtmlIsNull_ReturnsEmptyString()
    {
        // Arrange
        // Act
        var result = ((string)null).StakeText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void StakeText_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        var html = string.Empty;

        // Act
        var result = html.StakeText();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void StakeText_HtmlHasStakeClass_ReturnsInnerTextOfStake()
    {
        // Arrange
        const string html = "<div class='stake'>10.00</div>";

        // Act
        var result = html.StakeText();

        // Assert
        Assert.Equal("10.00", result);
    }

    [Fact]
    public void StakeText_HtmlContainsOriginalStake_ReturnsStakeOriginalStake()
    {
        // Arrange
        const string html = "<div class='stake'>10.00</div><div class='originalStake'>(+5.00)</div>";

        // Act
        var result = html.StakeText();

        // Assert
        Assert.Equal($"(+5.00){Environment.NewLine}10.00", result);
    }

    [Fact]
    public void StakeText_HtmlContainsLightBlue_ReturnsStakeLightBlue()
    {
        // Arrange
        const string html = "<div class='stake'>10.00</div><div class='light-blue'>(+5.00)</div>";

        // Act
        var result = html.StakeText();

        // Assert
        Assert.Equal($"10.00{Environment.NewLine}(+5.00)", result);
    }

    [Fact]
    public void StakeText_HtmlContainsRebateBonusClass_ReturnsStakeWithRebateBonus()
    {
        // Arrange
        const string html = "<div class='stake'>10.00</div><div class='rebate-bonus'>+5.00</div>";

        // Act
        var result = html.StakeText();

        // Assert
        Assert.Equal($"10.00{Environment.NewLine}(+5.00)", result);
    }

    [Fact]
    public void StakeText_HtmlContainsNPHPromotionClass_ReturnsStakeWithNPHPromotion()
    {
        // Arrange
        const string html = "<div class='stake'>10.00</div><div class='nph-promotion'>(+2.50)</div>";

        // Act
        var result = html.StakeText();

        // Assert
        Assert.Equal($"10.00{Environment.NewLine}((+2.50))", result);
    }

    [Fact]
    public void StakeText_HtmlContainsReturnStake_ReturnsStakeReturnStake()
    {
        // Arrange
        const string html = "<div class='stake'>10.00</div><div class='return-stake'>(+5.00)</div><div class='discount'>7.00</div>";

        // Act
        var result = html.StakeText();

        // Assert
        Assert.Equal($"10.00{Environment.NewLine}(+5.00){Environment.NewLine}7.00", result);
    }


    [Fact]
    public void LineBreak_HtmlIsNull_ReturnsEmptyString()
    {
        // Arrange
        // Act
        var result = ((string)null).LineBreak();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void LineBreak_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        var html = string.Empty;

        // Act
        var result = html.LineBreak();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void LineBreak_HtmlNotNull_ReturnsExpected()
    {
        // Arrange
        const string html = "<div class='stake'>10.00</div><br><div class='return-stake'>(+5.00)";
        var expected = $"10.00{Environment.NewLine}(+5.00)";

        // Act
        var result = html.LineBreak();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void Handicap_HtmlIsNull_ReturnEmptyString()
    {
        // Arrange
        var doc = Substitute.For<HtmlDocument>();

        // Act
        var result = ((string)null).Handicap(doc);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void Handicap_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        var html = string.Empty;
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
        // Act
        var result = ((string)null).ChoiceSubParlay(true, false);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        var html = string.Empty;

        // Act
        var result = html.ChoiceSubParlay(true, false);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlHasOfferNameIsNull_ReturnsChoice()
    {
        // Arrange
        const string html = "<div class='match'>10.00</div><br><div class='league'>(+5.00)</ div ><div class='sub-odds'></div><br><div class='bettype'><a>Choice 1</a><br>><span class='bet-team-choice'>Handicap 1</span>(+5.00)</ div >";
        const string expected = "Choice 1\nHandicap 1\nChoice 1>Handicap 1(+5.00)\n10.00\n(+5.00)Choice 1>Handicap 1(+5.00)";

        // Act
        var result = html.ChoiceSubParlay(true, false);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlHasOfferNameNameIsNotNull_ReturnsOfferNameList()
    {
        // Arrange
        const string html = "<div class='match'>10.00</div><br><div class='league'>(+5.00)</ div ><div class='sub-odds'></div><br><div class='offer-name-list'><div class='bettype'><a>Choice 1</a><br>><span class='bet-team-choice'>Handicap 1</span>(+5.00)</ div ></ div >";
        const string expected = "Choice 1\nChoice 1>Handicap 1(+5.00)\nHandicap 1\nChoice 1>Handicap 1(+5.00)\n10.00\n(+5.00)Choice 1>Handicap 1(+5.00)";

        // Act
        var result = html.ChoiceSubParlay(true, false);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlContainsExcludingChoices_ReturnsHasSecondLine()
    {
        // Arrange
        const string html = "<div class='match'>10.00</div><br><div class='league'>(+5.00)</ div ><div class='bettype'>Bettype 1</ div ><div class='sub-odds'></div><br><div class='offer-name-list'><div class='excluding-choices'><a>Choice 1</a><br>><span class='bet-team-choice'>Handicap 1<br>Handicap 2</span></ div ></ div >";
        const string expected = "Handicap 1\nChoice 1>Handicap 1Handicap 2\nBettype 1Choice 1>Handicap 1Handicap 2\n10.00\n(+5.00)Bettype 1Choice 1>Handicap 1Handicap 2";

        // Act
        var result = html.ChoiceSubParlay(false, false);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ChoiceSubParlay_HtmlContainsCashOutFromNo_ReturnsHasSecondLine()
    {
        // Arrange
        const string html = "<div class='match'>10.00</div><br><div class='league'>(+5.00)</ div ><div class='bettype'><div class='bettype-description'>Bettype 1</ div ></ div ><div class='sub-odds'></div><br><div class='offer-name-list'><div class='Cash Out from No'><a>Choice 1</a><br>><span class='bet-team-choice'>Handicap 1<br>Handicap 2</span></ div ></ div >";
        const string expected = "Handicap 1\nHandicap 2\nBettype 1Choice 1>Handicap 1Handicap 2\nBettype 1Choice 1>Handicap 1Handicap 2\n10.00\n(+5.00)Bettype 1Choice 1>Handicap 1Handicap 2";

        // Act
        var result = html.ChoiceSubParlay(false, false);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ChoiceShortSubParlay_HtmlIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        var html = string.Empty;

        // Act
        var result = html.ChoiceShortSubParlay(true);

        // Assert
        Assert.Equal(string.Empty, result);
    }


}

