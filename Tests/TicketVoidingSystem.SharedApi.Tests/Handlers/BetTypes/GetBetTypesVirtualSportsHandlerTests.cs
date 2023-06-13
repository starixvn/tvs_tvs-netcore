using NSubstitute;
using Xunit;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using System.Threading;
using System.Threading.Tasks;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.BetTypes;

public class GetBetTypesVirtualSportsHandlerTests
{
    private readonly BetTypesService betTypesService;
    private readonly GetBetTypesVirtualSportsHandler handler;

    public GetBetTypesVirtualSportsHandlerTests()
    {
        betTypesService = Substitute.For<BetTypesService>();
        handler = new GetBetTypesVirtualSportsHandler(betTypesService);
    }

    [Fact]
    public async Task Handle_HasRequest_ReturnListGroupBetTypeVirtualSport()
    {

        // Arrange
        var request = new GetBetTypesVirtualSportRequest();
        
        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
    }
}