using System.Collections.Generic;
using System.Linq;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class BuildLogsDataServiceTests
{
    private readonly GetLinkedLogShowUiService getLinkedLogShowUiService;
    private readonly BuildLogsDataServiceImp service;

    public BuildLogsDataServiceTests()
    {
        getLinkedLogShowUiService = Substitute.For<GetLinkedLogShowUiService>();
        service = new BuildLogsDataServiceImp(getLinkedLogShowUiService);
    }

    [Theory]
    [InlineData(LinkedLogApiConstant.GroupId1X2, IssueTypeConstant.WrongHDP, SubIssueTypeConstant.Handicap, "1X2")]
    [InlineData(LinkedLogApiConstant.GroupIdAio, IssueTypeConstant.WrongOU, SubIssueTypeConstant.Handicap, "AIO")]
    [InlineData(LinkedLogApiConstant.GroupId1H1X2, IssueTypeConstant.Wrong1stHDP, SubIssueTypeConstant.Handicap,
        "1H 1X2")]
    [InlineData(99, IssueTypeConstant.WrongHDP, SubIssueTypeConstant.Wrong1stOU, "")]
    [InlineData(99, IssueTypeConstant.Wrong1stOU, SubIssueTypeConstant.Wrong1stOU, "")]
    [InlineData(99, IssueTypeConstant.WrongOdds, SubIssueTypeConstant.Handicap, "")]
    [InlineData(99, IssueTypeConstant.WrongOdds, SubIssueTypeConstant.OverUnder, "")]
    [InlineData(99, IssueTypeConstant.WrongOdds, SubIssueTypeConstant.WrongOU, "")]
    [InlineData(99, IssueTypeConstant.DangerAccepted, SubIssueTypeConstant.WrongOU, "")]
    public void Execute_InValidQuery_NotCalledExpected(int groupId, int issueTypeId, int subIssueTypeId,
        string groupName)
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = issueTypeId, SubIssueTypeId = subIssueTypeId };
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = BetTypeConstant.Handicap } },
            { 2, new LinkedOddsInfo { BetType = BetTypeConstant.OverUnder } }
        };
        var resultFromApi = new List<PoolHouseLinkedLogResponse>
            { new() { LinkGroup = groupId, LinkedOddsInfoDic = linkedOddsInfoDic } };

        var linkedLogShowUi = new List<PoolHouseLinkedLogResponse>
            { new() { LinkGroup = groupId, LinkedOddsInfoDic = linkedOddsInfoDic } };
        getLinkedLogShowUiService.GetLinkedLogShowUi(getLinkedLogModel, resultFromApi)
            .ReturnsForAnyArgs(linkedLogShowUi);
        // Act
        var actual = service.GenerateGroupPoolHouseLinkedLog(resultFromApi, getLinkedLogModel);

        // Assert
        getLinkedLogShowUiService.Received(1).GetLinkedLogShowUi(getLinkedLogModel, resultFromApi);
        Assert.Equal(groupName, actual.First().GroupName);
    }
}