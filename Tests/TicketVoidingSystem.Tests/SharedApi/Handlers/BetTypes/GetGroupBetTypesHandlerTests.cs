using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.BetTypes;

public class GetGroupBetTypesHandlerTests
{
    private readonly BetTypesService betTypeService;
    private readonly GetGroupBetTypesHandler handler;

    public GetGroupBetTypesHandlerTests()
    {
        betTypeService = Substitute.For<BetTypesService>();
        handler = new GetGroupBetTypesHandler(betTypeService);
    }

    [Fact]
    public async Task Handle_HasRequest_CallGetGroupBetTypes()
    {
        // Arrange
        var request = new GetGroupBetTypesRequest();
        
        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await betTypeService.Received().GetGroupBetTypes(request);
    }
}