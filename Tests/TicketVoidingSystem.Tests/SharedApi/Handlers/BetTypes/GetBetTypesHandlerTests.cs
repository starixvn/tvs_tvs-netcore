using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.BetTypes;

public class GetBetTypesHandlerTests
{
    private readonly BetTypesRepository betTypesRepository;
    private readonly GetBetTypesHandler handler;

    public GetBetTypesHandlerTests()
    {
        betTypesRepository = Substitute.For<BetTypesRepository>();
        handler = new GetBetTypesHandler(betTypesRepository);
    }

    [Fact]
    public async Task Handle_HasRequest_CallGetBetTypes()
    {
        // Arrange
        var request = new GetBetTypesRequest();

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await betTypesRepository.Received().GetBetTypes(request);
    }
}