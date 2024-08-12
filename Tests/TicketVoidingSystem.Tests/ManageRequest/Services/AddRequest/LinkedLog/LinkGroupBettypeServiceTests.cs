using System;
using System.Collections.Generic;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class LinkGroupBettypeServiceTests
{
    [Theory]
    [InlineData(IssueTypeConstant.WrongHDP, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.WrongOU, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.Wrong1stOU, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.WrongOdds, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.WrongOdds, SubIssueTypeConstant.OverUnder)]
    public void CheckAffectedToGroup_ValidData_ReturnIsLinkGroup1X2AndIsLinkGroupAIO(int issueTypeId, int subIssueTypeId)
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = subIssueTypeId,
            IssueTypeId = issueTypeId,
            MatchId = 1,
            LiveIndicator = 1,
            FilterFromTransTime = new DateTime(2022, 2, 2, 2, 2, 2)
        };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new() { Time = new DateTime(2022, 2, 2, 2, 2, 2), LinkGroup = LinkedLogApiConstant.GroupIdAio },
            new() { Time = new DateTime(2022, 2, 2, 2, 2, 2), LinkGroup = LinkedLogApiConstant.GroupId1X2 },
            new() { Time = new DateTime(2022, 2, 2, 2, 2, 2), LinkGroup = LinkedLogApiConstant.GroupId1H1X2 }
        };

        var service = new LinkGroupBettypeServiceImp();

        // Act
        var actual = service.CheckAffectedToGroup(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.True(actual.IsLinkGroup1X2);
        Assert.True(actual.IsLinkGroupAIO);
    }

    [Theory]
    [InlineData(IssueTypeConstant.DangerAccepted, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.WrongOdds, SubIssueTypeConstant.FixGame)]
    public void CheckAffectedToGroup_ValidData_ReturnNotLinkGroup1X2AndNotLinkGroupAIO(int issueTypeId, int subIssueTypeId)
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = subIssueTypeId,
            IssueTypeId = issueTypeId,
            MatchId = 1,
            LiveIndicator = 1,
            FilterFromTransTime = new DateTime(2022, 2, 2, 2, 2, 2)
        };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new() { Time = new DateTime(2022, 2, 2, 2, 2, 2), LinkGroup = LinkedLogApiConstant.GroupId1X2 }
        };

        var service = new LinkGroupBettypeServiceImp();

        // Act
        var actual = service.CheckAffectedToGroup(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.False(actual.IsLinkGroup1X2);
        Assert.False(actual.IsLinkGroupAIO);
    }
}