using System;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest;

public class GetRequestHandlerTests
{
    private readonly GetRequestService getRequestService = Substitute.For<GetRequestService>();
    private readonly LoggingService loggingService = Substitute.For<LoggingService>();

    [Fact]
    public async Task Handle_RepositoryHasCalled_ReturnViewModelExpected()
    {
        // Arrange
        var request = new GetRequestRequest();
        var expected = new RequestDetailViewModel();
        getRequestService.GetRequest(Arg.Any<GetRequestRequest>()).ReturnsForAnyArgs(expected);
        var handler = new GetRequestHandler(getRequestService, null);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
        await getRequestService.Received().GetRequest(Arg.Any<GetRequestRequest>());
    }

    [Fact]
    public async Task Handle_GetRequestNetSuccess_ShowWriteLog()
    {
        // Arrange
        var request = new GetRequestRequest();
        var getRequestException = new Exception("Has Error Get Request");
        getRequestService.GetRequest(Arg.Any<GetRequestRequest>()).Throws(getRequestException);
        var handler = new GetRequestHandler(getRequestService, loggingService);

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await loggingService.Received().ErrorAsync(getRequestException);
    }
}