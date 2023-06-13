using NSubstitute;
using Xunit;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using System.Threading;
using System.Threading.Tasks;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers;

public class GetBetTeamsHandlerTests
{
    private readonly BetTeamsService betTeamsService;
    private readonly GetBetTeamsHandler handler;

    public GetBetTeamsHandlerTests()
    {
        betTeamsService = Substitute.For<BetTeamsService>();
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