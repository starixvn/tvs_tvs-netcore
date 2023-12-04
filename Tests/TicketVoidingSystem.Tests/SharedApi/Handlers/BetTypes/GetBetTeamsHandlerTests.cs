using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.BetTypes;

public class GetBetTeamsHandlerTests
{
    private readonly GetBetTeamsHandler handler;

    public GetBetTeamsHandlerTests()
    {
        var betTeamsService = Substitute.For<BetTeamsService>();
        handler = new GetBetTeamsHandler(betTeamsService);
    }

    [Fact]
    public async Task Handle_HasRequest_ReturnListBetTeams()
    {
        // Arrange
        var request = new GetBetTeamsRequest();

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
    }
}