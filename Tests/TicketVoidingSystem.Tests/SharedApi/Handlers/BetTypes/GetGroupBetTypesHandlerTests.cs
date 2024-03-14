using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.BetTypes;

public class GetGroupBetTypesHandlerTests
{
    private readonly BetTypesRepository betTypesRepository;
    private readonly GetGroupBetTypesHandler handler;

    public GetGroupBetTypesHandlerTests()
    {
        betTypesRepository = Substitute.For<BetTypesRepository>();
        handler = new GetGroupBetTypesHandler(betTypesRepository);
    }

    [Fact]
    public async Task Handle_HasBetTypesIsNull_CallGetBetTypesHaveTickets()
    {
        // Arrange
        var request = new GetGroupBetTypesRequest
        {
            BetTypes = null
        };
        var betTypes = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        betTypesRepository.GetBetTypesHaveTickets(Arg.Any<GetGroupBetTypesRequest>()).ReturnsForAnyArgs(new List<int> { 1234 });
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypes);

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await betTypesRepository.Received(1).GetBetTypes(Arg.Any<GetBetTypesCriteria>());
        await betTypesRepository.Received(1).GetBetTypesHaveTickets(Arg.Any<GetGroupBetTypesRequest>());
    }

    [Fact]
    public async Task Handle_HasValueBetTypes_BotCallGetBetTypesHaveTickets()
    {
        // Arrange
        var request = new GetGroupBetTypesRequest
        {
            BetTypes = "1234"
        };
        var betTypes = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypes);

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await betTypesRepository.Received(1).GetBetTypes(Arg.Any<GetBetTypesCriteria>());
        await betTypesRepository.Received(0).GetBetTypesHaveTickets(Arg.Any<GetGroupBetTypesRequest>());
    }
}