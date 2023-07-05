using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.LetstalkService.Core.Models;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class GetVoidResultCacheHandlerTests
{
    private readonly VoidResultCacheService voidResultCacheService;
    private readonly GetVoidResultCacheHandler handler;

    public GetVoidResultCacheHandlerTests()
    {
        voidResultCacheService = Substitute.For<VoidResultCacheService>();
        handler = new GetVoidResultCacheHandler(voidResultCacheService);
    }

    [Fact]
    public async Task Handle_Returns_HasCallGetVoidResultCache()
    {
        // Arrange
        var request = new GetVoidResultCacheRequest();
        var expected = new List<Result> { };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await voidResultCacheService.Received().GetVoidResultCache(request.Guid);
    }
}