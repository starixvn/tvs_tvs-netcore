using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SignalR;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest;

public class InsertQueueHandlerTests
{
    [Fact]
    public async Task InsertQueue_Successfully_ReturnSuccessfulResult()
    {
        // Arrange
        var insertQueueService = Substitute.For<InsertQueueService>();
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        var signalRService = Substitute.For<NotificationSignalRService>();

        var insertQueueRequest = new InsertQueueRequest();
        sessionService.CheckPassword(insertQueueRequest.UserPassword).ReturnsForAnyArgs(true);
        var handler = new InsertQueueHandler(insertQueueService, sessionService, loggingService, signalRService);

        // Act
        _ = await handler.Handle(insertQueueRequest, CancellationToken.None);

        // Assert
        await insertQueueService.Received(1).InsertTicketVoidingQueue(insertQueueRequest);
        sessionService.Received(1).CheckPassword(insertQueueRequest.UserPassword);
        await insertQueueService.Received(1).InsertTicketVoidingQueue(insertQueueRequest);
        await insertQueueService.Received(1).UpdateIsProcessed(insertQueueRequest);
        await signalRService.Received(1).UpdateRequestStatusToAllUser(Arg.Any<List<RequestStatus>>());
    }

    [Fact]
    public async Task InsertQueue_WrongPassword_ReturnErrorResult()
    {
        // Arrange
        var insertQueueService = Substitute.For<InsertQueueService>();
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        var signalRService = Substitute.For<NotificationSignalRService>();
        var insertQueueRequest = new InsertQueueRequest();
        sessionService.CheckPassword(insertQueueRequest.UserPassword).ReturnsForAnyArgs(false);
        var handler = new InsertQueueHandler(insertQueueService, sessionService, loggingService, signalRService);

        // Act
        var result = await handler.Handle(insertQueueRequest, CancellationToken.None);

        // Assert
        await insertQueueService.DidNotReceive().InsertTicketVoidingQueue(insertQueueRequest);
        Assert.Equal(ErrorCode.WrongPassword, result.ErrorCode);
        Assert.Equal("Sorry. You can not process void bet due to either wrong password or insufficient permission!",
            result.ErrorMsg);
    }

    [Fact]
    public async Task InsertQueue_UpdateNetPositionFailed_ReturnErrorResult()
    {
        // Arrange
        var insertQueueService = Substitute.For<InsertQueueService>();
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        var signalRService = Substitute.For<NotificationSignalRService>();
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var insertQueueRequest = new InsertQueueRequest
        {
            CricketTickets = tickets,
            SingleTickets = tickets,
            ParlayTickets = tickets,
            CashOutTickets = tickets
        };

        sessionService.CheckPassword(insertQueueRequest.UserPassword).ReturnsForAnyArgs(true);
        var handler = new InsertQueueHandler(insertQueueService, sessionService, loggingService, signalRService);

        // Act
        _ = await handler.Handle(insertQueueRequest, CancellationToken.None);

        // Assert
        await insertQueueService.Received(1).InsertTicketVoidingQueue(insertQueueRequest);
    }

    [Fact]
    public async Task InsertQueue_ThrowException_ReturnErrorResult()
    {
        // Arrange
        var insertQueueService = Substitute.For<InsertQueueService>();
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        var signalRService = Substitute.For<NotificationSignalRService>();
        var insertQueueRequest = new InsertQueueRequest();

        var exception = new Exception("The request cannot void. Please contact IT team.");
        sessionService.CheckPassword(insertQueueRequest.UserPassword).ReturnsForAnyArgs(_ => throw exception);
        var handler = new InsertQueueHandler(insertQueueService, sessionService, loggingService, signalRService);

        // Act
        var result = await handler.Handle(insertQueueRequest, CancellationToken.None);

        // Assert
        Assert.Throws<Exception>(() => sessionService.CheckPassword(insertQueueRequest.UserPassword));
        Assert.Equal(ErrorCode.InsertQueueException, result.ErrorCode);
        Assert.Equal(exception.Message, result.ErrorMsg);
        await loggingService.Received(1).ErrorAsync(exception);
    }
}