using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetLinkedLogHandlerTests
{
    private readonly GetLinkedLogService getLinkedLogService;
    private readonly GetLinkedLogHandler handler;

    public GetLinkedLogHandlerTests()
    {
        getLinkedLogService = Substitute.For<GetLinkedLogService>();
        handler = new GetLinkedLogHandler(getLinkedLogService);
    }

    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        getLinkedLogService.GetDefaultLogData(Arg.Any<GetLinkedLogRequest>())
            .ReturnsForAnyArgs(new List<PoolHouseLinkedLogData>());
        getLinkedLogService.GetLinkedLogWhenSuccess(Arg.Any<GetLinkedLogRequest>(),
                Arg.Any<IEnumerable<PoolHouseLinkedLogData>>())
            .ReturnsForAnyArgs(new LinkedLogDataViewModel());
        var viewModel = new LinkedLogDataViewModel();

        // Act
        var actual = await handler.Handle(null, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }

    [Fact]
    public async Task Handler_HasException_HasGetLinkedLogWhenError()
    {
        // Arrange
        getLinkedLogService.GetDefaultLogData(Arg.Any<GetLinkedLogRequest>())
            .ReturnsForAnyArgs(new List<PoolHouseLinkedLogData>());
        getLinkedLogService.GetLinkedLogWhenSuccess(Arg.Any<GetLinkedLogRequest>(),
                Arg.Any<IEnumerable<PoolHouseLinkedLogData>>())
            .Throws(new Exception());
        getLinkedLogService.GetLinkedLogWhenError(Arg.Any<Exception>(),
            Arg.Any<IEnumerable<PoolHouseLinkedLogData>>()).ReturnsForAnyArgs(new LinkedLogDataViewModel());

        // Act
        _ = await handler.Handle(null, CancellationToken.None);

        // Assert
        await getLinkedLogService.Received(1).GetLinkedLogWhenError(Arg.Any<Exception>(),
            Arg.Any<IEnumerable<PoolHouseLinkedLogData>>());
    }
}