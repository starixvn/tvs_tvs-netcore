using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class MarkTicketsServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly LoggingService loggingService;
    private readonly IDynamicRepository repository;
    private readonly MarkTicketsServiceImp service;
    private readonly SessionService sessionService;

    public MarkTicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        sessionService = Substitute.For<SessionService>();
        loggingService = Substitute.For<LoggingService>();
        service = new MarkTicketsServiceImp(repository, sessionService,
            loggingService);
    }

    [Fact]
    public async Task Execute_Successful_ReturnExpected()
    {
        // Arrange
        sessionService.GetClientIp().ReturnsForAnyArgs("1");
        repository.FetchAsync<Result>(Arg.Any<MarkTicketsCommand>())
            .ReturnsForAnyArgs(new List<Result> { new() { ErrorCode = 0 } });

        // Act
        var actual = await service.MarkTicketsInTVS("1", 1, 1);

        // Assert
        Assert.Equal(0, actual.First().ErrorCode);
    }

    [Fact]
    public async Task Execute_HasException_ReturnExpected()
    {
        // Arrange
        var exception = new Exception();
        sessionService.GetClientIp().Throws(exception);

        // Act
        var actual = await service.MarkTicketsInTVS("1", 1, 1);

        // Assert
        await loggingService.Received(1).ErrorAsync(Arg.Any<Exception>());
        Assert.Equal(1, actual.First().ErrorCode);
    }
}