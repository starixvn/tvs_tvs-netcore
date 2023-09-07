using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class GetLinkedLogServiceTests
{
    private readonly BuildLogsDataService buildLogsDataService;
    private readonly LinkedLogApiService linkedLogApiService;
    private readonly LinkGroupBettypeService linkGroupBettypeService;
    private readonly LoggingService loggingService;
    private readonly GetLinkedLogServiceImp service;

    public GetLinkedLogServiceTests()
    {
        loggingService = Substitute.For<LoggingService>();
        linkedLogApiService = Substitute.For<LinkedLogApiService>();
        linkGroupBettypeService = Substitute.For<LinkGroupBettypeService>();
        buildLogsDataService = Substitute.For<BuildLogsDataService>();
        service = new GetLinkedLogServiceImp(loggingService, linkedLogApiService, linkGroupBettypeService,
            buildLogsDataService);
    }

    [Fact]
    public async Task GetLinkedLogWhenSuccess_ValidData_ReturnExpected()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel();
        var defaultLogData = new List<PoolHouseLinkedLogData> { new() };
        var resultFromApi = new List<PoolHouseLinkedLogResponse> { new() };
        var linkGroupBettypeValidation = new LinkGroupBettypeValidation
            { IsLinkGroup1X2 = true, IsLinkGroupAIO = false };
        linkedLogApiService.GetLinkedLog(getLinkedLogModel).ReturnsForAnyArgs(resultFromApi);
        var groupPoolHouseLinkedLog = new List<PoolHouseLinkedLogData> { new() };
        linkGroupBettypeService.CheckAffectedToGroup(getLinkedLogModel, resultFromApi)
            .ReturnsForAnyArgs(linkGroupBettypeValidation);
        buildLogsDataService.GenerateGroupPoolHouseLinkedLog(resultFromApi, getLinkedLogModel)
            .ReturnsForAnyArgs(groupPoolHouseLinkedLog);
        var expected = new LinkedLogDataViewModel
        {
            PoolHouseLinkedLogsData = groupPoolHouseLinkedLog,
            IsLinkGroup1X2 = linkGroupBettypeValidation.IsLinkGroup1X2,
            IsLinkGroupAIO = linkGroupBettypeValidation.IsLinkGroupAIO,
            Result = new Result
            {
                ErrorCode = 0,
                ErrorMsg = string.Empty
            }
        };
        // Act
        var actual = await service.GetLinkedLogWhenSuccess(getLinkedLogModel, defaultLogData);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task GetLinkedLogWhenSuccess_NoHasGroupPoolHouseLinkedLog_ReturnExpected()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel();
        var defaultLogData = new List<PoolHouseLinkedLogData> { new() };
        var resultFromApi = new List<PoolHouseLinkedLogResponse> { new() };
        var linkGroupBettypeValidation = new LinkGroupBettypeValidation
            { IsLinkGroup1X2 = true, IsLinkGroupAIO = false };
        linkedLogApiService.GetLinkedLog(getLinkedLogModel).ReturnsForAnyArgs(resultFromApi);
        var groupPoolHouseLinkedLog = new List<PoolHouseLinkedLogData>();
        linkGroupBettypeService.CheckAffectedToGroup(getLinkedLogModel, resultFromApi)
            .ReturnsForAnyArgs(linkGroupBettypeValidation);
        buildLogsDataService.GenerateGroupPoolHouseLinkedLog(resultFromApi, getLinkedLogModel)
            .ReturnsForAnyArgs(groupPoolHouseLinkedLog);
        var expected = new LinkedLogDataViewModel
        {
            PoolHouseLinkedLogsData = defaultLogData,
            IsLinkGroup1X2 = linkGroupBettypeValidation.IsLinkGroup1X2,
            IsLinkGroupAIO = linkGroupBettypeValidation.IsLinkGroupAIO,
            Result = new Result
            {
                ErrorCode = 0,
                ErrorMsg = string.Empty
            }
        };
        // Act
        var actual = await service.GetLinkedLogWhenSuccess(getLinkedLogModel, defaultLogData);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task GetLinkedLogWhenError_ValidData_ReturnExpected()
    {
        // Arrange
        var exception = new Exception();
        var defaultLogData = new List<PoolHouseLinkedLogData>();
        var expected = new LinkedLogDataViewModel
        {
            PoolHouseLinkedLogsData = defaultLogData,
            Result = new Result
            {
                ErrorCode = 1,
                ErrorMsg = "Cannot get link log"
            }
        };

        // Act
        var actual = await service.GetLinkedLogWhenError(exception, defaultLogData);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Theory]
    [InlineData(IssueTypeConstant.WrongHDP, "1X2", 1)]
    [InlineData(IssueTypeConstant.WrongOU, "1X2", 1)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, "1H 1X2", 1)]
    [InlineData(IssueTypeConstant.Wrong1stOU, "1H 1X2", 1)]
    [InlineData(IssueTypeConstant.WrongOdds, "1X2", SubIssueTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.WrongOdds, "1H 1X2", 1)]
    [InlineData(1, "", 1)]
    public async Task GetDefaultLogData_ValidData_ReturnExpected(int issueTypeId, string groupName, int subIssueTypeId)
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { SubIssueTypeId = subIssueTypeId, IssueTypeId = issueTypeId };
        var expected = new List<PoolHouseLinkedLogData>
        {
            new() { GroupName = groupName },
            new() { GroupName = "AIO" }
        };

        // Act
        var actual = service.GetDefaultLogData(getLinkedLogModel);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}