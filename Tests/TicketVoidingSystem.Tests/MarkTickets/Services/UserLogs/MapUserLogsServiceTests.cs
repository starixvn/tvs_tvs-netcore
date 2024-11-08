using System;
using System.Collections.Generic;
using System.Linq;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Constants;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.Services.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Services.UserLogs;

public class MapUserLogsServiceTests
{
    [Theory]
    [InlineData(UserLogConstant.ManualMark)]
    [InlineData(UserLogConstant.ManualUnmark)]
    [InlineData(UserLogConstant.AutoMark)]
    [InlineData(UserLogConstant.AutoUnmark)]
    [InlineData(UserLogConstant.UnmarkAll)]
    [InlineData(1)]
    public void MapToUserLogViewModels_ReturnExpectedResult(int logActionId)
    {
        // Arrange
        var userLogTicketInfo = new UserLogTicketInfo
        {
            SingleTickets = new List<TicketInfo> { new() { TransId = "100001" }, new() { TransId = "100004" }, new() { TransId = "100005" } },
            ParlayTickets = new List<TicketInfo> { new() { TransId = "100002" }, new() { TransId = "100003" }, new() { TransId = "100006" } }
        };
        var originalLogs = new List<GetUserLogModel>
        {
            new()
            {
                MatchId = 9000001,
                LogActionId = logActionId,
                LogData = "",
                SessionId = 1,
                CreatedDate = new DateTime(2022,2,2),
                TransIds = new List<string> { "100001",  "100002", "100003", "100004", "100005", "100006" } }
        };
        var expected = new GetUserLogViewModel
        {
            MatchId = 9000001,
            No = 1,
            ActionId = 1,
            LogDate = new DateTime(2022, 2, 2),
            SingleTickets = new List<string> { "100001", "100004", "100005" },
            ParlayTickets = new List<string> { "100002", "100003", "100006" }
        };

        var remotingRefService = Substitute.For<RemotingRefWrapperService>();
        remotingRefService.GetTeamName(default, default, default).ReturnsForAnyArgs("");
        var service = new MapUserLogsServiceImp(remotingRefService);

        // Act
        var actual = service.MapToUserLogViewModels(originalLogs, userLogTicketInfo);
        var originalLog = actual.First();

        // Assert
        AssertExtension.Equal(expected.MatchId, originalLog.MatchId);
        AssertExtension.Equal(expected.No, originalLog.No);
        AssertExtension.Equal(expected.ActionId, originalLog.ActionId);
        AssertExtension.Equal(expected.LogDate, originalLog.LogDate);
        AssertExtension.Equal(expected.SingleTickets, originalLog.SingleTickets);
        AssertExtension.Equal(expected.ParlayTickets, originalLog.ParlayTickets);
    }
}