using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.BetTypes;

public class GetBetTypesVirtualSportsHandlerTests
{
    private readonly GetBetTypesVirtualSportsHandler handler;
    private readonly BetTypesRepository betTypesRepository;

    public GetBetTypesVirtualSportsHandlerTests()
    {
        betTypesRepository = Substitute.For<BetTypesRepository>();
        handler = new GetBetTypesVirtualSportsHandler(betTypesRepository);
    }

    [Fact]
    public async Task Handle_HasRequest_CallExpected()
    {
        // Arrange
        var request = new GetBetTypesVirtualSportRequest
        {
            MatchId = 124,
            Mode = 1
        };
        const string betTypesHaveTickets = "1234";
        betTypesRepository.GetBetTypesHaveTickets(Arg.Any<BetTypeQueryModel>()).ReturnsForAnyArgs(new List<int> { 1234 });

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await betTypesRepository.Received(1).GetBetTypesHaveTickets(Arg.Any<BetTypeQueryModel>());
        await betTypesRepository.Received(1).GetBetTypesTicketListingVirtualSport(request.MatchId, betTypesHaveTickets);
    }
}