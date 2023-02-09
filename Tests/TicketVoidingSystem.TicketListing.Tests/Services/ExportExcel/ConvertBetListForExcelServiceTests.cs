using System.Collections;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Services.ExportExcel;

public class ConvertBetListForExcelServiceTests
{
    [Theory]
    [InlineData("<div>1.98</div>", 1.98)]
    public void ConvertWinLoss_CheckValidWinLoss_ReturnValue(string html, decimal expected)
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var service = new ConvertBetListForExcelServiceImp(repository);

        // Act
        var actual = service.WinLossHtmlToText(html);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("", null)]
    public void ConvertWinLoss_HtmlEmpty_ReturnValue(string html, decimal? expected)
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var service = new ConvertBetListForExcelServiceImp(repository);

        // Act
        var actual = service.WinLossHtmlToText(html);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [ClassData(typeof(ChoiceTestCase))]
    public void ConvertChoice_InputChoiceHtml_ReturnText(string html, string expected)
    {
        // Arrange
        var models = new List<SelectionSMP>
        {
            new() { Result = TicketStatus.Running, SelectionName = "a1" },
            new() { Result = TicketStatus.Won, SelectionName = "a2" },
            new() { Result = null, SelectionName = "a1" },
        };
        var repository = Substitute.For<IDynamicRepository>();
        repository.Fetch<SelectionSMP>(new GetSelectionsSMPCriteria()).ReturnsForAnyArgs(models);
        var service = new ConvertBetListForExcelServiceImp(repository);

        // Act
        var actual = service.ChoiceHtmlToText(html, "12345");

        // Assert
        Assert.Equal(expected, actual);
    }
}

public class ChoiceModel
{
    public string Html { get; set; }

    public string Expected { get; set; }
}

public class ChoiceTestCase : IEnumerable<object[]>
{
    private static readonly ChoiceModel SingleTicket = new()
    {
        Html = "<div class=''><span class='favorite'>Over<span class='handicap'> 3<span class='odds'> @ 1.82</span></span></span></div>",
        Expected = "Over 3 @ 1.82"
    };

    private static readonly ChoiceModel ParlayTicketOneComboName = new()
    {
        Html = "<div><span class='combo-name'>13-Fold (1 Bet)</span></div>" +
               "<div class=''><span class='favorite'>Over<span class='handicap'> 3<span class='odds'> @ 1.82</span></span></span></div>",
        Expected = "13-Fold (1 Bet)\r\nOver 3 @ 1.82"
    };

    private static readonly ChoiceModel ParlayTicketTwoComboName = new()
    {
        Html = "<div><span class='combo-name'>Doubles (10 Bets)</span></div>" +
               "<div><span class='combo-name'>5-Fold (1 Bet)</span></div>" +
               "<div class=''><span class='favorite'>FT.1<span class='handicap'><span class='odds'> @ 1.74</span></span></span></div>",
        Expected = "Doubles (10 Bets)\r\n5-Fold (1 Bet)\r\nFT.1 @ 1.74"
    };

    private static readonly ChoiceModel AosTicket = new()
    {
        Html = "<div class=''>" +
               "<span class='favorite'>AOS<span class='handicap'> 3<span class='odds'> @ 1.82</span></span></span>" +
               "<span>Excluding: 1-0,2-0</span>" +
               "</div>",
        Expected = "AOS 3 @ 1.82\r\nExcluding: 1-0,2-0"
    };

    private static readonly ChoiceModel Lucky3 = new()
    {
        Html = "<div class=''>" +
               "<span class='lucky3'>02, 08, 21" +
               "<span class='handicap'>Combination x UUS 1" +
               "<div class='num-of-bets'>1 Bet</div></span></span></div>",
        Expected = "02, 08, 21\r\nCombination x UUS 1\r\n1 Bet"
    };

    private static readonly ChoiceModel ChoiceSingleMatchParlay = new()
    {
        Html = "<div><span class='combinationLink'>13-Fold (1 Bet)</span></div>" +
               "<div class='bettype'><span class='favorite'>Over<span class=''> 3<span class='odds'> @ 1.82</span></span></span></div>",
        Expected = "Over 3 @ 1.82\r\na1\r\na2 - won\r\na1\r\n"
    };

    private static readonly ChoiceModel BetType = new()
    {
        Html = "<div class='bettype-description'>13-Fold (1 Bet)</div>" +
               "<div class='bettype'><span class='favorite'>Over<span class=''> 3<span class='odds'> @ 1.82</span></span></span></div>",
        Expected = "Over 3 @ 1.82\r\nOver 3 @ 1.82\r\n13-Fold (1 Bet)"
    };

    private static readonly ChoiceModel BetTypeHaveNotDescription = new()
    {
        Html = "<div><span class='bettype-description'></span></div>" +
               "<div class='bettype'><span class='favorite'>Over<span class=''> 3<span class='odds'> @ 1.82</span></span></span></div>",
        Expected = "Over 3 @ 1.82"
    };

    private static readonly ChoiceModel ChoiceHaveHaveRefund = new()
    {
        Html = "<div class='refund'>1.82</div>",
        Expected = "1.82"
    };

    private readonly IEnumerable<object[]> testCase = new List<object[]>
    {
        new object[] { SingleTicket.Html, SingleTicket.Expected },
        new object[] { ParlayTicketOneComboName.Html, ParlayTicketOneComboName.Expected },
        new object[] { ParlayTicketTwoComboName.Html, ParlayTicketTwoComboName.Expected },
        new object[] { AosTicket.Html, AosTicket.Expected },
        new object[] { Lucky3.Html, Lucky3.Expected },
        new object[] { ChoiceSingleMatchParlay.Html, ChoiceSingleMatchParlay.Expected },
        new object[] { BetType.Html, BetType.Expected },
        new object[] { BetTypeHaveNotDescription.Html, BetTypeHaveNotDescription.Expected },
        new object[] { ChoiceHaveHaveRefund.Html, ChoiceHaveHaveRefund.Expected }
    };

    public IEnumerator<object[]> GetEnumerator() => testCase.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}