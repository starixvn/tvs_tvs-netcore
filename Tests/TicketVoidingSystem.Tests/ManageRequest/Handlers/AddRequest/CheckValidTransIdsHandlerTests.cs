using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class CheckValidTransIdsHandlerTests
{
    private readonly CheckValidTransIdsService checkValidTransIdsService;
    private readonly CheckValidTransIdsHandler handler;

    public CheckValidTransIdsHandlerTests()
    {
        checkValidTransIdsService = Substitute.For<CheckValidTransIdsService>();
        handler = new CheckValidTransIdsHandler(checkValidTransIdsService);
    }

    [Fact]
    public async Task Handler_Successful_CalledExpected()
    {
        // Arrange
        // Act
        _ = await handler.Handle(null, CancellationToken.None);

        // Assert
        await checkValidTransIdsService.Received(1).CheckValidTransIds(Arg.Any<CheckValidTransIdsRequest>());
    }
}