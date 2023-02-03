using NSubstitute;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.Services.UserLogs;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.UserLogs
{
    public class MapUserLogsServiceTests
    {
        [Fact]
        public void MapToUserLogViewModels_ReturnExpectedResult()
        {
            // Arrange
            var userLogTicketInfo = new UserLogTicketInfo
            {
                SingleTickets = new List<TicketInfo> { new() { TransId = "100001" } },
                ParlayTickets = new List<TicketInfo> { new() { TransId = "100002" }, new() { TransId = "100003" } },
            };
            var originalLogs = new List<GetUserLogModel>
            {
                new()
                {
                    MatchId = 9000001,
                    LogActionId = 1,
                    LogData = "",
                    TransIds = new List<string> { "100001",  "100002", "100003" } }
            };
            var remotingRefService = Substitute.For<RemotingRefWrapperService>();
            remotingRefService.GetTeamName(default, default).ReturnsForAnyArgs("");
            var service = new MapUserLogsServiceImp(remotingRefService);

            // Act
            var actual = service.MapToUserLogViewModels(originalLogs, userLogTicketInfo);

            // Assert
            Assert.Equal(originalLogs.FirstOrDefault().SessionId, actual.FirstOrDefault().ActionId);
            Assert.Equal(originalLogs.FirstOrDefault().MatchId, actual.FirstOrDefault().MatchId);
        }
    }
}