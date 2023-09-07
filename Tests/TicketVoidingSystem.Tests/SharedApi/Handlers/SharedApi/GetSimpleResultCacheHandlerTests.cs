using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class GetSimpleResultCacheHandlerTests
{
    [Fact]
    public async Task Handle_CallExpected()
    {
        // Arrange
        var resultCacheService = Substitute.For<ResultCacheService>();
        resultCacheService.GetSimpleResultCache(default).ReturnsForAnyArgs(new Result());
        var handler = new GetSimpleResultCacheHandler(resultCacheService);
        var request = new GetSimpleResultCacheRequest { Guid = "1" };

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await resultCacheService.Received(1).GetSimpleResultCache("1");
    }
}