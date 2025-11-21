using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;
using RemarkModel = TicketVoidingSystem.ManageRequest.Models.ManageRemark.RemarkModel;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark;

public class RenderRemarkServiceTests
{
    private readonly RemotingRefWrapperService remotingRefWrapperService;
    private readonly MatchService matchService;
    private readonly DescriptionElementService elementService;
    private readonly RenderRemarkServiceImp service;

    public RenderRemarkServiceTests()
    {
        remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        matchService = Substitute.For<MatchService>();
        elementService = Substitute.For<DescriptionElementService>();
        service = new RenderRemarkServiceImp(remotingRefWrapperService, matchService, elementService);
    }

    [Fact]
    public void UpdateDescription_ValidRemarks_UpdateDescriptionCorrectly()
    {
        // Arrange
        var remarks = new List<RemarkModel>
        {
            new()
            {
                RemarkId = 1,
                SportType = 1,
                HomeId = 10,
                AwayId = 20,
                LeagueId = 5,
                MatchCode = "MATCH001",
                Description = "Test description",
                IsCheckedVar = false
            }
        };
        remotingRefWrapperService.GetTeamName(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>())
            .ReturnsForAnyArgs("Team");
        remotingRefWrapperService.GetSportName(Arg.Any<string>(), Arg.Any<string>())
            .ReturnsForAnyArgs("Football");
        remotingRefWrapperService.GetLeagueName(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>())
            .ReturnsForAnyArgs("Premier League");
        matchService.GetMatchEvent(Arg.Any<Match>())
            .ReturnsForAnyArgs("Team A - Team B");
        elementService.BuildLeague(Arg.Any<string>(), Arg.Any<string>())
            .ReturnsForAnyArgs("<span>Premier League</span>");

        // Act
        service.UpdateDescription(remarks);

        // Assert
        var remark = remarks[0];
        Assert.NotNull(remark.Description);
        Assert.NotNull(remark.DescriptionInput);
        Assert.Equal("Test description", remark.DescriptionInput);
        Assert.NotNull(remark.SportTypeName);
        Assert.NotNull(remark.LeagueName);
        Assert.NotNull(remark.EventName);
        remotingRefWrapperService.Received().GetTeamName(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>());
        remotingRefWrapperService.Received().GetSportName(Arg.Any<string>(), Arg.Any<string>());
        remotingRefWrapperService.Received().GetLeagueName(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>());
        matchService.Received().GetMatchEvent(Arg.Any<Match>());
    }

    [Fact]
    public void UpdateDescription_IsCheckedVarTrue_IncludeVarCheckInDescription()
    {
        // Arrange
        var remarks = new List<RemarkModel>
        {
            new()
            {
                RemarkId = 1,
                SportType = 1,
                HomeId = 10,
                AwayId = 20,
                LeagueId = 5,
                MatchCode = "MATCH001",
                Description = "Test description",
                IsCheckedVar = true
            }
        };
        remotingRefWrapperService.GetTeamName(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>())
            .ReturnsForAnyArgs("Team");
        remotingRefWrapperService.GetSportName(Arg.Any<string>(), Arg.Any<string>())
            .ReturnsForAnyArgs("Football");
        remotingRefWrapperService.GetLeagueName(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>())
            .ReturnsForAnyArgs("Premier League");
        matchService.GetMatchEvent(Arg.Any<Match>())
            .ReturnsForAnyArgs("Team A - Team B");
        elementService.BuildLeague(Arg.Any<string>(), Arg.Any<string>())
            .ReturnsForAnyArgs("<span>Premier League</span>");

        // Act
        service.UpdateDescription(remarks);

        // Assert
        var remark = remarks[0];
        Assert.Contains("VAR", remark.Description);
        Assert.Contains("text-danger", remark.Description);
    }

    [Fact]
    public void UpdateActionName_ValidRemarks_UpdateActionNameCorrectly()
    {
        // Arrange
        var remarks = new List<RemarkModel>
        {
            new() { RemarkId = 1, ActionId = "1" },
            new() { RemarkId = 2, ActionId = "2" }
        };

        // Act
        service.UpdateActionName(remarks);

        // Assert
        foreach (var remark in remarks)
        {
            Assert.NotNull(remark.ActionName);
            Assert.Contains("span", remark.ActionName);
        }
    }

    [Fact]
    public void UpdateActionName_EmptyRemarks_NoException()
    {
        // Arrange
        var remarks = new List<RemarkModel>();

        // Act & Assert
        service.UpdateActionName(remarks);
        Assert.Empty(remarks);
    }

    [Fact]
    public void UpdateDescription_MultipleRemarks_UpdateAllRemarks()
    {
        // Arrange
        var remarks = new List<RemarkModel>
        {
            new()
            {
                RemarkId = 1,
                SportType = 1,
                HomeId = 10,
                AwayId = 20,
                LeagueId = 5,
                MatchCode = "MATCH001",
                Description = "Description 1"
            },
            new()
            {
                RemarkId = 2,
                SportType = 2,
                HomeId = 30,
                AwayId = 40,
                LeagueId = 6,
                MatchCode = "MATCH002",
                Description = "Description 2"
            }
        };
        remotingRefWrapperService.GetTeamName(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>())
            .ReturnsForAnyArgs("Team");
        remotingRefWrapperService.GetSportName(Arg.Any<string>(), Arg.Any<string>())
            .ReturnsForAnyArgs("Sport");
        remotingRefWrapperService.GetLeagueName(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>())
            .ReturnsForAnyArgs("League");
        matchService.GetMatchEvent(Arg.Any<Match>())
            .ReturnsForAnyArgs("Match Event");
        elementService.BuildLeague(Arg.Any<string>(), Arg.Any<string>())
            .ReturnsForAnyArgs("<span>League</span>");

        // Act
        service.UpdateDescription(remarks);

        // Assert
        Assert.Equal(2, remarks.Count);
        Assert.NotNull(remarks[0].Description);
        Assert.NotNull(remarks[1].Description);
    }
}