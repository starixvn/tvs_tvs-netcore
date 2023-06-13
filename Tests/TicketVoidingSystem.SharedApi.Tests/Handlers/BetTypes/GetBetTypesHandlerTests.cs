using NSubstitute;
using Xunit;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using System.Threading;
using System.Threading.Tasks;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.BetTypes;

public class GetBetTypesHandlerTests
{
    private readonly BetTypesService betTypeService;
    private readonly GetBetTypesHandler handler;

    public GetBetTypesHandlerTests()
    {
        betTypeService = Substitute.For<BetTypesService>();
        handler = new GetBetTypesHandler(betTypeService);
    }

    [Fact]
    public async Task Handle_HasRequest_CallGetBetTypes()
    {
        // Arrange
        var request = new GetBetTypesRequest();
        
        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        await betTypeService.Received().GetBetTypes(request);
    }
}