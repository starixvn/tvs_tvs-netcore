using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using SpecialDelete.VoidByCurrency.Services.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services.ExportExcel;

public class ChoiceTestCaseModel
{
    public string Html { get; set; }

    public string Expected { get; set; }
}

internal class ChoiceTestCase : IEnumerable<object[]>
{
    private static readonly ChoiceTestCaseModel Single = new()
    {
        Html = "<div class=''><span class='underdog'>The Field<span class='handicap'> </span></span><div class='bettype'> Moneyline</div></div>",
        Expected = "The Field \n Moneyline"
    };

    private static readonly ChoiceTestCaseModel Aos = new()
    {
        Html = "<div class=''><span class='favorite'>AOS<span class='handicap'> </span>" +
               "<div class='excluding-choices'>Excluding: 1-0, 2-0</div></span><div class='bettype'> Correct Score</div></div>",
        Expected = "AOS \nExcluding: 1-0, 2-0\n Correct Score"
    };

    private static readonly ChoiceTestCaseModel CashOut = new()
    {
        Html = "<div class=''><span class='underdog'><div class='underdog'>Cash Out from No.: 9799003457</div>" +
               "Preston North End<span class='handicap'> 2.5</span></span><div class='bettype'> Handicap</div></div>",
        Expected = "Cash Out from No.: 9799003457\nPreston North End 2.5\n Handicap"
    };

    private static readonly ChoiceTestCaseModel SingleHasDesc = new()
    {
        Html = "<div class='bettype-description'><span class='underdog'><div class='underdog'>Cash Out from No.: 9799003457</div>" +
               "Preston North End<span class='handicap'> 2.5</span></span><div class='bettype'> Handicap</div></div>",
        Expected = "Cash Out from No.: 9799003457\nPreston North End 2.5\n Handicap\nCash Out from No.: 9799003457Preston North End 2.5 Handicap"
    };

    private static readonly ChoiceTestCaseModel SingleParlay = new()
    {
        Html = "<div class='bettype'><div class='combinationLink'><div><a>Single Match Parlay</a></div></div>" +
               "<div id='divEvent_1070963377980'><div class='smp-group-selections'><div><span class='selection-smp'>Match event - Penalty missed</span></div>" +
               "<div><span class='selection-smp'>Match goals - under 3.5</span> - <span class='selection-result'>Won</span></div>" +
               "<div><span class='selection-smp'>Correct score - St Etienne 2-0</span> - <span class='selection-result'>Lose</span></div></div></div></div>",
        Expected = "Single Match Parlay"
    };

    private static readonly ChoiceTestCaseModel Parlay = new()
    {
        Html = "<div class='combinationLink'><a>Mix Parlay</a><div class='offer-name-list'><div>6-Fold (1 Bet)</div></div></div>" +
               "<div><div class=''><span class='favorite'>Over<span class='handicap'> 2.75<span class='odds'> @ 2.01</span></span></span><div class='bettype'> Over/Under</div></div></div>",
        Expected = "Mix Parlay\n6-Fold (1 Bet)\nOver 2.75 @ 2.01\n Over/Under"
    };

    private readonly IEnumerable<object[]> testCase = new List<object[]>
    {
        new object[] { Single },
        new object[] { Aos },
        new object[] { CashOut },
        new object[] { SingleHasDesc },
        new object[] { SingleParlay },
        new object[] { Parlay },
    };

    public IEnumerator<object[]> GetEnumerator() => testCase.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}


public class ConvertServiceTest
{
    [Theory]
    [ClassData(typeof(ChoiceTestCase))]
    public void Convert_ChoiceHtml_ReturnInnerText(ChoiceTestCaseModel model)
    {
        // Arrange
        var service = new ConvertServiceImp();

        // Act
        var choice = service.Choice(model.Html);

        // Assert
        Assert.Equal(model.Expected, choice);
    }
}