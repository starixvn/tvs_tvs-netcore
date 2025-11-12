using System;
using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

public class DescriptionElementServiceTests
{
    [Theory]
    [InlineData(1)]
    [InlineData(4)]
    public void BuildVoidTime_FilterByTransTime_ReturnString(int filterBy)
    {
        // Arrange
        const string expectedResult =
            "<div class=\"void-time\"><span class=\"text-success\">Void Trans Time: 12:00:00.000 PM - 12:00:00.000 PM</span></div>";
        var time = new DateTime();
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildVoidTime(filterBy, time, time);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildVoidTime_FilterByCheckTime_ReturnString()
    {
        // Arrange
        const string expectedResult =
            "<div class=\"void-time\"><span class=\"text-primary\">Void Accept Time: 12:00:00.000 PM - 12:00:00.000 PM</span></div>";
        var time = new DateTime();
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildVoidTime(2, time, time);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildLogId_FromIdEqualToId_ReturnString()
    {
        // Arrange
        const int fromId = 1;
        const int told = 1;
        const string expectedResult = "<div class\"log-id\">LogID: <span class=\"text-danger\">1</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildLogId(fromId, told);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildLogId_FromIdNotEqualToId_ReturnString()
    {
        // Arrange
        const int fromId = 1;
        const int told = 2;
        const string expectedResult = "<div class\"log-id\">LogID: <span class=\"text-danger\">1-2</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildLogId(fromId, told);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildMatch_WhenCalled_ReturnString()
    {
        // Arrange
        const string expectedResult = "<div class=\"match\">abc</div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildMatch("abc");

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildLeague_WhenCalled_ReturnString()
    {
        // Arrange
        const string sportTypeName = "1";
        const string leagueName = "2";
        const string expectedResult =
            $"<div class=\"event\"><span class=\"sport\">{sportTypeName} </span><span class=\"league text-uppercase\">{leagueName}</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildLeague(sportTypeName, leagueName);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildTotal_IsSingle_ReturnString()
    {
        // Arrange
        const int single = 1;
        var expectedResult =
            $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">{single}</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildTotal(single, null, new List<string>());

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildTotal_HasParlay_ReturnString()
    {
        // Arrange
        const int single = 1;
        const int parlay = 1;
        var expectedResult = $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">"
                             + $"{single}</span>, Parlay: <span class=\"text-primary total-parlay\">{parlay}</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildTotal(single, parlay, new List<string>());

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildTotal_BettypeNamesHasOneElement_ReturnString()
    {
        // Arrange
        const int single = 1;
        const int parlay = 1;
        var bettypeNames = new List<string> { "abc" };
        var expectedResult = $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">"
                             + $"{single}</span>, Parlay: <span class=\"text-primary total-parlay\">{parlay}</span> (abc)</div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildTotal(single, parlay, bettypeNames);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildTotal_BettypeNamesHasFourElement_ReturnString()
    {
        // Arrange
        const int single = 1;
        const int parlay = 1;
        var bettypeNames = new List<string> { "1", "2", "3", "4" };
        var expectedResult = $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">"
                             + $"{single}</span>, Parlay: <span class=\"text-primary total-parlay\">{parlay}</span> (1, 2, 3...)</div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildTotal(single, parlay, bettypeNames);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildTotal_BettypeNamesEmpty_ReturnString()
    {
        // Arrange
        const int single = 1;
        const int parlay = 1;
        var bettypeNames = new List<string> { "1" };
        const string expectedResult = "<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">1"
                                      + "</span>, Parlay: <span class=\"text-primary total-parlay\">1</span> (1)</div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildTotal(single, parlay, bettypeNames);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildVoidTimeAbnormalAccount_HasDate_ReturnString()
    {
        // Arrange
        var fromDate = new DateTime(2021, 01, 11);
        var toDate = new DateTime(2021, 01, 19);
        const string expectedResult =
            "<div class=\"void-time\">Void Time: <span class=\"text-success\">2021/01/11 - 2021/01/19</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildVoidTimeAbnormalAccount(fromDate, toDate);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildNoOfAccount_HasTotal_ReturnString()
    {
        // Arrange
        const string expectedResult =
            "<div class=\"no-of-account\">No. of Account: <span class=\"text-primary total-account\">10<span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildNoOfAccount(10);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildWrongScores_FilterByCheckTime_ReturnString()
    {
        // Arrange
        const string expectedResult =
            "<div class=\"text-primary\"><div class=\"void-wrong-score\">Void Accept Time - Wrong Score: <span class=\"wrong-score\">0-0<span></div></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildWrongScores(2, "0-0");

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildWrongScores_FilterByNotAcceptedTime_ReturnStringExpected()
    {
        // Arrange
        const string expectedResult =
            "<div class=\"text-success\"><div class=\"void-wrong-score\">Void Trans Time - Wrong Score: <span class=\"wrong-score\">0-0<span></div></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildWrongScores(1, "0-0");

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildMixParlay_HasTotal_ReturnString()
    {
        // Arrange
        const string expectedResult = "<div>Mix Parlay: <span class=\"text-primary total-mix-parlay\">1</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildMixParlay(1);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildWithVarCheck_CheckedVarIsTrue_ReturnExpected()
    {
        // Arrange
        const string expectedResult = "<div><span class=\"text-danger var-check\"><strong>VAR</strong> - </span>" +
                                      "<span class=\"match\">1</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildWithVarCheck("1", true);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildWithVarCheck_CheckedVarIsFalse_ReturnExpected()
    {
        // Arrange
        const string expectedResult = "<div><span class=\"match\">1</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildWithVarCheck("1", false);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildParlay_ReturnExpected()
    {
        // Arrange
        const string expectedResult = "<div>Parlay: <span class=\"text-primary total-parlay\">1</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildParlay(1);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildProducts_ReturnExpected()
    {
        // Arrange
        const string expectedResult = "<div>Product: <span class=\"text-primary product\">Sportsbook</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildProducts("Sportsbook");

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildKoTime_WhenCalled_ReturnString()
    {
        // Arrange
        var time = new DateTime(2021, 01, 11, 14, 30, 45);
        const string expectedResult = "<div class=\"ko-time\">KO Time: <span class=\"text-success\">2021/01/11 02:30:45 PM</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildKoTime(time);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildVoidTime_FilterByIsNull_ReturnString()
    {
        // Arrange
        const string expectedResult =
            "<div class=\"void-time\"><span class=\"text-success\">Void Trans Time: 12:00:00.000 PM - 12:00:00.000 PM</span></div>";
        var time = new DateTime();
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildVoidTime(null, time, time);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildTotal_BettypeNamesHasTwoElements_ReturnString()
    {
        // Arrange
        const int single = 1;
        const int parlay = 1;
        var bettypeNames = new List<string> { "abc", "def" };
        var expectedResult = $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">"
                             + $"{single}</span>, Parlay: <span class=\"text-primary total-parlay\">{parlay}</span> (abc, def)</div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildTotal(single, parlay, bettypeNames);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildTotal_BettypeNamesHasThreeElements_ReturnString()
    {
        // Arrange
        const int single = 1;
        const int parlay = 1;
        var bettypeNames = new List<string> { "abc", "def", "ghi" };
        var expectedResult = $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">"
                             + $"{single}</span>, Parlay: <span class=\"text-primary total-parlay\">{parlay}</span> (abc, def, ghi)</div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildTotal(single, parlay, bettypeNames);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildHybridParlay_HasTotal_ReturnString()
    {
        // Arrange
        const string expectedResult = "<div>Bet Builder<sup>+</sup>: <span class=\"text-primary total-bet-builder-plus\">5</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildHybridParlay(5);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void BuildSystemParlay_HasTotal_ReturnString()
    {
        // Arrange
        const string expectedResult = "<div>System Parlay: <span class=\"text-primary total-system-parlay\">10</span></div>";
        var descriptionService = new DescriptionElementServiceImp();

        // Act
        var actual = descriptionService.BuildSystemParlay(10);

        // Assert
        Assert.Equal(expectedResult, actual);
    }
}