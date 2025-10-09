using System;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageVoidServices.Handlers;

public class UpdateSummaryTicket19999HandlerTests
{
    private readonly OnlineServerRepository onlineServerRepository;
    private readonly LoggingService loggingService;
    private readonly UpdateSummaryTicket19999Handler handler;

    public UpdateSummaryTicket19999HandlerTests()
    {
        onlineServerRepository = Substitute.For<OnlineServerRepository>();
        loggingService = Substitute.For<LoggingService>();
        handler = new UpdateSummaryTicket19999Handler(onlineServerRepository, loggingService);
    }

    [Fact]
    public async Task Handle_ShouldReturnSuccessResult_WhenExecuteAsyncSucceeds()
    {
        // Arrange
        var request = new UpdateSummaryTicket19999Request();

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.ErrorCode);
        await onlineServerRepository.Received(1).ExecuteAsync(Arg.Any<UpdateSummaryTicket19999Command>());
        await loggingService.DidNotReceive().ErrorAsync(Arg.Any<string>(), Arg.Any<Exception>());
    }

    [Fact]
    public async Task Handle_ShouldReturnFailedResultAndLogError_WhenExecuteAsyncThrows()
    {
        // Arrange
        var request = new UpdateSummaryTicket19999Request();
        var exception = new Exception("Test exception");

        onlineServerRepository.ExecuteAsync(Arg.Any<UpdateSummaryTicket19999Command>()).ThrowsAsync(exception);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(ExecuteStatus.Failed, result.ErrorCode);
        Assert.Equal("Test exception", result.ErrorMsg);
        await loggingService.Received(1).ErrorAsync(exception.Message, exception);
    }
}