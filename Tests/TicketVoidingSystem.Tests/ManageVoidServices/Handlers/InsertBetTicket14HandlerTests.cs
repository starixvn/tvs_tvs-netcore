using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageVoidServices.Handlers;

public class InsertBetTicket14HandlerTests
{
    private readonly OnlineServerRepository onlineServerRepository;
    private readonly LoggingService loggingService;
    private readonly InsertBetTicket14Handler handler;

    public InsertBetTicket14HandlerTests()
    {
        onlineServerRepository = Substitute.For<OnlineServerRepository>();
        loggingService = Substitute.For<LoggingService>();
        handler = new InsertBetTicket14Handler(onlineServerRepository, loggingService);
    }

    [Fact]
    public async Task Handle_ShouldReturnCombinedResults_WhenRepositoryReturnsValidData()
    {
        // Arrange
        var request = new InsertBetTicket14Request();
        var repoResults = new List<InsertBetTicket14ResultModel>
        {
            new()
            {
                InvalidTransIds = "1,2",
                BalanceUpTransIds = "10,11"
            },
            new()
            {
                InvalidTransIds = "2,3",
                BalanceUpTransIds = "11,12"
            }
        };

        onlineServerRepository
            .FetchAsync<InsertBetTicket14ResultModel>(request)
            .Returns(Task.FromResult<IEnumerable<InsertBetTicket14ResultModel>>(repoResults));

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("2", result.InvalidTransIds);       // intersection
        Assert.Equal("11", result.BalanceUpTransIds);    // intersection
        Assert.Equal(0, result.ErrorCode);
    }

    [Fact]
    public async Task Handle_ShouldLogErrorAndReturnFailedResult_WhenExceptionThrown()
    {
        // Arrange
        var request = new InsertBetTicket14Request();
        var exception = new Exception("Test exception");

        onlineServerRepository
            .FetchAsync<InsertBetTicket14ResultModel>(request)
            .ThrowsAsync(exception);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(ExecuteStatus.Failed, result.ErrorCode);
        Assert.Equal("Test exception", result.ErrorMsg);

        await loggingService.Received(1).ErrorAsync(exception.Message, exception);
    }
}