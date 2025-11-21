using System;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark;

public class AddRemarkServiceTests
{
    private readonly IMapper mapper;
    private readonly SessionService sessionService;
    private readonly IDynamicRepository repository;
    private readonly LoggingService loggingService;
    private readonly AddRemarkServiceImp service;

    public AddRemarkServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        sessionService = Substitute.For<SessionService>();
        repository = Substitute.For<IDynamicRepository>();
        loggingService = Substitute.For<LoggingService>();
        service = new AddRemarkServiceImp(mapper, sessionService, repository, loggingService);
    }

    [Fact]
    public async Task Execute_ValidQuery_ReturnSuccessResult()
    {
        // Arrange
        var query = new AddRemarkQuery
        {
            MatchId = 1,
            Description = "Test description",
            ActionId = "1"
        };
        var command = new AddRemarkCommand
        {
            RemarkId = 1,
            MatchId = query.MatchId
        };
        var userId = 100;
        var ip = "127.0.0.1";
        mapper.Map<AddRemarkCommand>(Arg.Any<AddRemarkQuery>())
            .ReturnsForAnyArgs(command);
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        var actual = await service.Execute(query);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(0, actual.ErrorCode);
        Assert.Equal("Success", actual.ErrorMsg);
        Assert.NotNull(actual.Data);
        await repository.Received().ExecuteAsync(Arg.Any<AddRemarkCommand>());
    }

    [Fact]
    public async Task Execute_ExceptionOccurred_ReturnErrorResult()
    {
        // Arrange
        var query = new AddRemarkQuery { MatchId = 1 };
        var exception = new Exception("Database error");
        mapper.Map<AddRemarkCommand>(Arg.Any<AddRemarkQuery>())
            .ReturnsForAnyArgs(new AddRemarkCommand());
        repository.ExecuteAsync(Arg.Any<AddRemarkCommand>())
            .Returns(Task.FromException<int>(exception));

        // Act
        var actual = await service.Execute(query);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(1, actual.ErrorCode);
        Assert.Equal("Database error", actual.ErrorMsg);
        await loggingService.Received().ErrorAsync(exception);
    }

    [Fact]
    public async Task Execute_CommandHasUserIdAndIP_SetCorrectly()
    {
        // Arrange
        var query = new AddRemarkQuery { MatchId = 1 };
        var command = new AddRemarkCommand { MatchId = query.MatchId };
        var userId = 100;
        var ip = "127.0.0.1";
        mapper.Map<AddRemarkCommand>(Arg.Any<AddRemarkQuery>())
            .ReturnsForAnyArgs(command);
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        _ = await service.Execute(query);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Is<AddRemarkCommand>(c => c.UserId == userId && c.IP == ip));
    }

    [Fact]
    public async Task Execute_ValidQuery_ReturnDataWithCorrectMatchId()
    {
        // Arrange
        var query = new AddRemarkQuery
        {
            MatchId = 123,
            Description = "Test description",
            ActionId = "1"
        };
        var command = new AddRemarkCommand
        {
            RemarkId = 456,
            MatchId = query.MatchId
        };
        var userId = 100;
        var ip = "127.0.0.1";
        mapper.Map<AddRemarkCommand>(Arg.Any<AddRemarkQuery>())
            .ReturnsForAnyArgs(command);
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        var actual = await service.Execute(query);

        // Assert
        Assert.NotNull(actual.Data);
        var data = (AddRemarkResultData)actual.Data;
        Assert.Equal(query.MatchId, data.MatchId);
        Assert.Equal(command.RemarkId, data.RemarkId);
    }

    [Fact]
    public async Task Execute_MapperCalledWithCorrectQuery()
    {
        // Arrange
        var query = new AddRemarkQuery { MatchId = 1, Description = "Test" };
        var command = new AddRemarkCommand { MatchId = query.MatchId };
        var userId = 100;
        var ip = "127.0.0.1";
        mapper.Map<AddRemarkCommand>(Arg.Any<AddRemarkQuery>())
            .ReturnsForAnyArgs(command);
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        _ = await service.Execute(query);

        // Assert
        mapper.Received().Map<AddRemarkCommand>(query);
    }
}