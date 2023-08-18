using System.Collections.Generic;
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
    [InlineData(LinkedLogApiConstant.GroupId1X2, IssueTypeConstant.WrongHDP, SubIssueTypeConstant.Handicap)]
    public void Execute_InValidQuery_NotCalledExpected(int groupId, int issueTypeId, int subIssueTypeId)
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = issueTypeId, SubIssueTypeId = subIssueTypeId };
        var linkedOddsInfo = new LinkedOddsInfo();
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        linkedOddsInfoDic.Add(1, linkedOddsInfo);
        var resultFromApi = new List<PoolHouseLinkedLogResponse>
            { new() { LinkGroup = groupId, LinkedOddsInfoDic = linkedOddsInfoDic } };

        var linkedLogShowUi = new List<PoolHouseLinkedLogResponse>
            { new() { LinkGroup = groupId, LinkedOddsInfoDic = linkedOddsInfoDic } };
        getLinkedLogShowUiService.GetLinkedLogShowUi(getLinkedLogModel, resultFromApi)
            .ReturnsForAnyArgs(linkedLogShowUi);
        // Act
        _ = service.GenerateGroupPoolHouseLinkedLog(resultFromApi, getLinkedLogModel);

        // Assert
        getLinkedLogShowUiService.Received(1).GetLinkedLogShowUi(getLinkedLogModel, resultFromApi);
    }
}