using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class AddRequestHandlerTests
{
    private readonly AddRequestService addRequestService;
    private readonly AddRequestHandler handler;
    private readonly ResultCacheService resultCacheService;

    public AddRequestHandlerTests()
    {
        resultCacheService = Substitute.For<ResultCacheService>();
        addRequestService = Substitute.For<AddRequestService>();
        handler = new AddRequestHandler(resultCacheService, addRequestService);
    }

    [Fact]
    public async Task Handler_Successful_HasCalledExpected()
    {
        // Arrange
        var request = new global::TicketVoidingSystem.ManageRequest.Handlers.AddRequest.AddRequest
        {
            Guid = "123"
        };
        resultCacheService.IsExistResult(request.Guid).ReturnsForAnyArgs(false);
        addRequestService.Execute(request).ReturnsForAnyArgs(new Result());

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await resultCacheService.Received(2).SetSimpleResultCache(request.Guid, Arg.Any<Result>());
        await addRequestService.Received(1).Execute(request);
    }

    [Fact]
    public async Task Handler_IsExistResult_HasError()
    {
        // Arrange
        var request = new global::TicketVoidingSystem.ManageRequest.Handlers.AddRequest.AddRequest
        {
            Guid = "123"
        };
        var result = new Result { ErrorCode = 1, ErrorMsg = "Duplicated Firefox Request" };
        resultCacheService.IsExistResult(request.Guid).ReturnsForAnyArgs(true);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(result, actual);
    }
}