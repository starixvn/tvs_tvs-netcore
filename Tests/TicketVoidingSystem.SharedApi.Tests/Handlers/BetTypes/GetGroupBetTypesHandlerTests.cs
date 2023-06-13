using NSubstitute;
using Xunit;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using System.Threading;
using System.Threading.Tasks;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.BetTypes;

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
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        await betTypeService.Received().GetGroupBetTypes(request);
    }
}