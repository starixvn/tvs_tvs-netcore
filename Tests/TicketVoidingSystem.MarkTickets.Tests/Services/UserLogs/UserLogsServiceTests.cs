using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.UserLogs;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.Services.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.UserLogs;

public class UserLogsServiceTests
{
    [Fact]
    public async Task GetUserLogs_HasCriteria_CallGetUserLogsByRepository()
    {
        // Arrange
        var query = new GetUserLogsQuery { LogDateTo = new DateTime(2023, 1, 1), LogDateFrom = new DateTime(2023, 1, 1) };
        var expected = new List<GetUserLogModel> { new() { TransIds = new List<string> { "100001", "100002", "100003" } } };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<GetUserLogModel>(default).ReturnsForAnyArgs(expected);
        var service = new UserLogsServiceImp(TestSetup.CreateMapper(), repository, null);

        // Act
        var actual = await service.GetUserLogs(query);

        // Assert
        Assert.Equal(expected.FirstOrDefault()?.TransIds, actual.FirstOrDefault()?.TransIds);
    }

    [Theory]
    [InlineData(UserLogConstant.ManualMark, "100001,100002,100003")]
    [InlineData(UserLogConstant.ManualUnmark, null)]
    [InlineData(UserLogConstant.AutoUnmark, null)]
    [InlineData(UserLogConstant.UnmarkAll, null)]
    [InlineData(UserLogConstant.AutoMark, null)]
    [InlineData(01, null)]
    public async Task CreateUserLogViewModels_HasOriginalLogs_ReturnViewModels(int logActionId, string logData)
    {
        // Arrange
        var originalLogs = new List<GetUserLogModel>
        {
            new()
            {
                MatchId = 9000001,
                LogActionId = logActionId,
                LogData = logData,
                TransIds = new List<string> { "100001",  "100002", "100003" } }
        };
        var userLogTicketInfo = new UserLogTicketInfo
        {
            SingleTickets = new List<TicketInfo> { new() { TransId = "100001" } },
            ParlayTickets = new List<TicketInfo> { new() { TransId = "100002" }, new() { TransId = "100003" } },
        };
        var viewModel = new List<GetUserLogViewModel>
        {
            new ()
            {
                MatchId = 9000001,
                Event = "TPS Turky - vs - TPS Turky"
            }
        };
        var mapper = Substitute.For<IMapper>();
        var repository = Substitute.For<IDynamicRepository>();
        var mapUserLogsService = Substitute.For<MapUserLogsService>();
        mapUserLogsService.MapToUserLogViewModels(default, default).ReturnsForAnyArgs(viewModel);
        repository.FetchMultipleAsync<TicketInfo, TicketInfo>(new GetUserLogTicketInfoCriteria())
            .ReturnsForAnyArgs((userLogTicketInfo.SingleTickets, userLogTicketInfo.ParlayTickets));
        var service = new UserLogsServiceImp(mapper, repository, mapUserLogsService);

        // Act
        var actual = await service.CreateUserLogViewModels(originalLogs);

        // Assert
        var userLog = actual.FirstOrDefault();
        Assert.Equal(9000001, userLog?.MatchId);
        Assert.Equal("TPS Turky - vs - TPS Turky", userLog?.Event);
    }
}