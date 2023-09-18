using System;
using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class LinkGroupBettypeServiceTests
{
    private readonly FilterLinkedLogService filterLinkedLogService;
    private readonly LinkGroupBettypeServiceImp service;

    public LinkGroupBettypeServiceTests()
    {
        filterLinkedLogService = Substitute.For<FilterLinkedLogService>();
        service = new LinkGroupBettypeServiceImp(filterLinkedLogService);
    }

    [Theory]
    [InlineData(IssueTypeConstant.WrongHDP, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.WrongOU, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.Wrong1stOU, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.WrongOdds, SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.WrongOdds, SubIssueTypeConstant.FixGame)]
    [InlineData(IssueTypeConstant.DangerAccepted, SubIssueTypeConstant.Handicap)]
    public void CheckAffectedToGroup_ValidData_ReturnExpected(int issueTypeId, int subIssueTypeId)
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
        var filterLinkedLogResult = new List<PoolHouseLinkedLogResponse> { new() };
        filterLinkedLogService.FilterApiResponse(getLinkedLogModel, apiLinkedLogResponses)
            .ReturnsForAnyArgs(filterLinkedLogResult);
        var expected = new LinkGroupBettypeValidation
        {
            IsLinkGroup1X2 = false,
            IsLinkGroupAIO = false
        };
        // Act
        var actual = service.CheckAffectedToGroup(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}