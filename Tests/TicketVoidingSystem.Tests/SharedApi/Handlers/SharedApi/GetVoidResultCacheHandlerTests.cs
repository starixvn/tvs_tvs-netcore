using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class GetVoidResultCacheHandlerTests
{
    private readonly GetVoidResultCacheHandler handler;
    private readonly ResultCacheService voidResultCacheService;

    public GetVoidResultCacheHandlerTests()
    {
        voidResultCacheService = Substitute.For<ResultCacheService>();
        handler = new GetVoidResultCacheHandler(voidResultCacheService);
    }

    [Fact]
    public async Task Handle_Returns_HasCallGetVoidResultCache()
    {
        // Arrange
        var request = new GetVoidResultCacheRequest();

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await voidResultCacheService.Received(1).GetVoidResultsCache(request.Guid);
    }
}