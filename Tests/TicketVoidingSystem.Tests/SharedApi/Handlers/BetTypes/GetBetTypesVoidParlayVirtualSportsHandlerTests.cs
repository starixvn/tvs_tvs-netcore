using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.BetTypes;

public class GetBetTypesVoidParlayVirtualSportsHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnBetTypes()
    {
        // Arrange
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        var handler = new GetBetTypesVoidParlayVirtualSportsHandler(betTypesRepository);
        var request = new GetBetTypesVoidParlayVirtualSportRequest();
        var expectedBetTypes = new List<GroupBetTypeVoidParlayVirtualSport>();
        betTypesRepository.GetVoidParlayVirtualSportsBetTypes().Returns(expectedBetTypes);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expectedBetTypes, result);
    }
}