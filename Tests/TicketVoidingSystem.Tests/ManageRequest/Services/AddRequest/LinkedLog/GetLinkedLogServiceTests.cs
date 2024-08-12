using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class GetLinkedLogServiceImpTests
{
    private readonly LoggingService loggingService;
    private readonly LinkedLogHttpClientService linkedLogHttpClientService;
    private readonly FilterLinkedLogService filterLinkedLogService;
    private readonly LinkGroupBettypeService linkGroupBettypeService;
    private readonly LinkedLogForUIService linkedLogForUIService;
    private readonly GetLinkedLogServiceImp service;

    public GetLinkedLogServiceImpTests()
    {
        loggingService = Substitute.For<LoggingService>();
        linkedLogHttpClientService = Substitute.For<LinkedLogHttpClientService>();
        filterLinkedLogService = Substitute.For<FilterLinkedLogService>();
        linkGroupBettypeService = Substitute.For<LinkGroupBettypeService>();
        linkedLogForUIService = Substitute.For<LinkedLogForUIService>();
        service = new GetLinkedLogServiceImp(loggingService, linkedLogHttpClientService, filterLinkedLogService, linkGroupBettypeService, linkedLogForUIService);
    }

    [Fact]
    public async Task GetLinkedLogWhenSuccess_ReturnsExpectedResult()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { MatchId = 123, LiveIndicator = 1, IssueTypeId = 1, SubIssueTypeId = 2 };
        var apiResponse = new List<PoolHouseLinkedLogResponse>();
        var groupLinkedLogResponse = new GroupLinkedLogResponse();
        var groupLinkedLogs = new List<GroupLinkedLogUI>();

        linkedLogHttpClientService.GetLinkedLog(getLinkedLogModel.MatchId, getLinkedLogModel.LiveIndicator).Returns(apiResponse);
        filterLinkedLogService.GroupBy(getLinkedLogModel, apiResponse).Returns(groupLinkedLogResponse);
        linkGroupBettypeService.CheckAffectedToGroup(getLinkedLogModel, groupLinkedLogResponse.AffectedLog).Returns((true, false));
        linkedLogForUIService.Build(groupLinkedLogResponse, getLinkedLogModel.IssueTypeId, getLinkedLogModel.SubIssueTypeId).Returns(groupLinkedLogs);

        // Act
        var result = await service.GetLinkedLogWhenSuccess(getLinkedLogModel);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(groupLinkedLogs, result.GroupLinkedLogs);
        Assert.True(result.IsLinkGroup1X2);
        Assert.False(result.IsLinkGroupAIO);
        Assert.Equal(0, result.Result.ErrorCode);
        Assert.Equal(string.Empty, result.Result.ErrorMsg);
    }

    [Fact]
    public async Task GetLinkedLogWhenError_ReturnsErrorResult()
    {
        // Arrange
        var exception = new Exception("Test exception");

        // Act
        var result = await service.GetLinkedLogWhenError(exception);

        // Assert
        await loggingService.Received(1).ErrorAsync("TicketVoidingSystem.ManageRequest.Services.LinkedLog.CallGetLinkedLog", exception);
        Assert.NotNull(result);
        Assert.Equal(1, result.Result.ErrorCode);
        Assert.Equal("Cannot get link log", result.Result.ErrorMsg);
    }
}