using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark;

public class UpdateRemarkServiceTests
{
    private readonly IMapper mapper;
    private readonly SessionService sessionService;
    private readonly IDynamicRepository repository;
    private readonly LoggingService loggingService;
    private readonly UpdateRemarkServiceImp service;

    public UpdateRemarkServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        sessionService = Substitute.For<SessionService>();
        repository = Substitute.For<IDynamicRepository>();
        loggingService = Substitute.For<LoggingService>();
        service = new UpdateRemarkServiceImp(mapper, sessionService, repository, loggingService);
    }

    [Fact]
    public async Task Execute_ValidQuery_ReturnSuccessResult()
    {
        // Arrange
        var query = new AddRemarkQuery
        {
            RemarkId = 1,
            MatchId = 1,
            Description = "Updated description",
            ActionId = "2"
        };
        var command = new UpdateRemarkCommand
        {
            RemarkId = query.RemarkId.Value
        };
        var userId = 100;
        var ip = "127.0.0.1";
        mapper.Map<UpdateRemarkCommand>(Arg.Any<AddRemarkQuery>())
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
        Assert.Equal(query.MatchId, ((AddRemarkResultData)actual.Data).MatchId);
        Assert.Equal(query.RemarkId, ((AddRemarkResultData)actual.Data).RemarkId);
        await repository.Received().ExecuteAsync(Arg.Any<UpdateRemarkCommand>());
    }

    [Fact]
    public async Task Execute_ExceptionOccurred_ReturnErrorResult()
    {
        // Arrange
        var query = new AddRemarkQuery { RemarkId = 1, MatchId = 1 };
        var exception = new Exception("Update failed");
        mapper.Map<UpdateRemarkCommand>(Arg.Any<AddRemarkQuery>())
            .ReturnsForAnyArgs(new UpdateRemarkCommand());
        repository.ExecuteAsync(Arg.Any<UpdateRemarkCommand>())
            .Returns(Task.FromException<int>(exception));

        // Act
        var actual = await service.Execute(query);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(1, actual.ErrorCode);
        Assert.Equal("Update failed", actual.ErrorMsg);
        await loggingService.Received().ErrorAsync(exception);
    }

    [Fact]
    public async Task Execute_CommandHasUserIdAndIP_SetCorrectly()
    {
        // Arrange
        var query = new AddRemarkQuery { RemarkId = 1, MatchId = 1 };
        var command = new UpdateRemarkCommand { RemarkId = 1 };
        var userId = 100;
        var ip = "127.0.0.1";
        mapper.Map<UpdateRemarkCommand>(Arg.Any<AddRemarkQuery>())
            .ReturnsForAnyArgs(command);
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        _ = await service.Execute(query);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Is<UpdateRemarkCommand>(c => c.UserId == userId && c.IP == ip));
    }

    [Fact]
    public async Task Execute_OperatorsListIsNull_CommandOperatorsIsNull()
    {
        // Arrange
        var query = new AddRemarkQuery { RemarkId = 1, MatchId = 1, OperatorsList = null };
        var command = new UpdateRemarkCommand { RemarkId = 1 };
        var userId = 100;
        var ip = "127.0.0.1";
        mapper.Map<UpdateRemarkCommand>(Arg.Any<AddRemarkQuery>())
            .ReturnsForAnyArgs(command);
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        _ = await service.Execute(query);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Is<UpdateRemarkCommand>(c => c.Operators == null));
    }

    [Fact]
    public async Task Execute_OperatorsListHasValue_CommandOperatorsIsSet()
    {
        // Arrange
        var query = new AddRemarkQuery
        {
            RemarkId = 1,
            MatchId = 1,
            OperatorsList = new List<OperatorQuery> { new() { OperatorId = 1, OperatorType = 1 } }
        };
        var command = new UpdateRemarkCommand { RemarkId = 1 };
        var userId = 100;
        var ip = "127.0.0.1";
        mapper.Map<UpdateRemarkCommand>(Arg.Any<AddRemarkQuery>())
            .ReturnsForAnyArgs(command);
        sessionService.UserId.Returns(userId);
        sessionService.GetClientIp().Returns(ip);

        // Act
        _ = await service.Execute(query);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Is<UpdateRemarkCommand>(c => c.Operators != null));
    }
}