using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using System.Collections.Generic;
using TicketVoidingSystem.Services;
using Fanex.LetstalkService.Core.Models;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.SharedApi;

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