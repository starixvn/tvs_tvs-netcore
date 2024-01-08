using System;
using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

public class DescriptionServiceTests
{
    private readonly DescriptionServiceImp descriptionService;
    private readonly DescriptionElementService elementService;

    public DescriptionServiceTests()
    {
        elementService = Substitute.For<DescriptionElementService>();
        descriptionService = new DescriptionServiceImp(elementService);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfBuildEKO()
    {
        // Arrange
        const string expectedResult = "123";
        var request = new RequestDescription { IssueTypeId = 8 };
        elementService.BuildKoTime(Arg.Compat.Any<DateTime>()).ReturnsForAnyArgs("1");
        elementService.BuildMatch(Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
        elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfBuildDefault()
    {
        // Arrange
        const string expectedResult = "1234";
        var request = new RequestDescription { IssueTypeId = 1000 };
        elementService.BuildLogId(Arg.Compat.Any<int>(), Arg.Compat.Any<int>()).ReturnsForAnyArgs("1");
        elementService.BuildMatch(Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
        elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");
        elementService.BuildTotal(Arg.Compat.Any<int>(), Arg.Compat.Any<int>(), Arg.Compat.Any<List<string>>())
            .ReturnsForAnyArgs("4");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfBuildAbnormalBet()
    {
        // Arrange
        const string expectedResult = "234";
        var request = new RequestDescription { IssueTypeId = 11 };
        elementService.BuildMatch(Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
        elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");
        elementService.BuildTotal(Arg.Compat.Any<int>(), null, Arg.Compat.Any<List<string>>()).ReturnsForAnyArgs("4");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfAbnormalBetParlay()
    {
        // Arrange
        const string expectedResult = "4";
        var request = new RequestDescription { IssueTypeId = IssueTypeConstant.AbnormalBet, FilterBy = 1 };
        elementService.BuildMixParlay(Arg.Compat.Any<int>()).ReturnsForAnyArgs("4");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfBuildDangerAccepted()
    {
        // Arrange
        const string expectedResult = "123";
        var request = new RequestDescription { IssueTypeId = 1, FilterBy = 1 };
        elementService.BuildVoidTime(Arg.Compat.Any<int>(), Arg.Compat.Any<DateTime>(), Arg.Compat.Any<DateTime>())
            .ReturnsForAnyArgs("1");
        elementService.BuildWithVarCheck(Arg.Compat.Any<string>(), Arg.Compat.Any<bool>()).ReturnsForAnyArgs("2");
        elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfAbnormalAccount()
    {
        // Arrange
        const string expectedResult = "2021/01/11 - 2021/01/1910";
        var request = new RequestDescription { IssueTypeId = 13 };
        elementService.BuildVoidTimeAbnormalAccount(Arg.Compat.Any<DateTime>(), Arg.Compat.Any<DateTime>())
            .ReturnsForAnyArgs("2021/01/11 - 2021/01/19");
        elementService.BuildNoOfAccount(Arg.Compat.Any<int>()).ReturnsForAnyArgs("10");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfAbnormalBetRealMember()
    {
        // Arrange
        var request = new RequestDescription { IssueTypeId = IssueTypeConstant.AbnormalBetRealMember };
        elementService.BuildMatch(Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
        elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");
        elementService.BuildTotal(Arg.Compat.Any<int>(), null, Arg.Compat.Any<List<string>>()).ReturnsForAnyArgs("4");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal("234", actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfWrongScore()
    {
        // Arrange
        var request = new RequestDescription { IssueTypeId = IssueTypeConstant.WrongScore, FilterBy = 1 };
        elementService.BuildWrongScores(Arg.Compat.Any<int>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
        elementService.BuildWithVarCheck(Arg.Compat.Any<string>(), Arg.Compat.Any<bool>()).ReturnsForAnyArgs("3");
        elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("4");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal("234", actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfArchivedTicket()
    {
        // Arrange
        var request = new RequestDescription { IssueTypeId = IssueTypeConstant.ArchivedTicket };
        elementService.BuildTotal(Arg.Compat.Any<int>(), Arg.Compat.Any<int>(), null).ReturnsForAnyArgs("4");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal("4", actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfReducedOver()
    {
        // Arrange
        const string expectedResult = "1league";
        var request = new RequestDescription { IssueTypeId = IssueTypeConstant.ReducedOver };
        elementService.BuildMatch(Arg.Any<string>()).ReturnsForAnyArgs("1");
        elementService.BuildLeague(Arg.Any<string>(), Arg.Any<string>()).ReturnsForAnyArgs("league");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Theory]
    [InlineData(1, "ab_parlay")]
    [InlineData(2, "1league1")]
    public void Build_WhenCalled_ReturnStringOfDuplicateTickets(int filterBy, string expectedResult)
    {
        // Arrange
        var request = new RequestDescription
        { IssueTypeId = IssueTypeConstant.DuplicateTickets, FilterBy = filterBy, TotalSingle = 1 };
        elementService.BuildMatch(Arg.Any<string>()).ReturnsForAnyArgs("1");
        elementService.BuildLeague(Arg.Any<string>(), Arg.Any<string>()).ReturnsForAnyArgs("league");
        elementService.BuildTotal(Arg.Any<int>(), null, Arg.Any<List<string>>()).ReturnsForAnyArgs("1");
        elementService.BuildParlay(1).ReturnsForAnyArgs(expectedResult);
        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal(expectedResult, actual);
    }

    [Fact]
    public void Build_WhenCalled_ReturnStringOfRecoverTicket()
    {
        // Arrange
        var request = new RequestDescription { IssueTypeId = IssueTypeConstant.RecoverTicket };
        elementService.BuildProducts(Arg.Compat.Any<string>()).ReturnsForAnyArgs("Sportsbook");
        elementService.BuildResettled(Arg.Compat.Any<int>()).ReturnsForAnyArgs("1");

        // Act
        var actual = descriptionService.Build(request);

        // Assert
        Assert.Equal("Sportsbook1", actual);
    }
}