using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetNotParticipateBetTypesHandlerTests
{
    private readonly GetNotParticipateBetTypesHandler handler;
    private readonly NotParticipateBetTypesService notParticipateBetTypesService;

    public GetNotParticipateBetTypesHandlerTests()
    {
        notParticipateBetTypesService = Substitute.For<NotParticipateBetTypesService>();
        handler = new GetNotParticipateBetTypesHandler(notParticipateBetTypesService);
    }

    [Fact]
    public async Task Handler_Successful_HasCallExpected()
    {
        // Arrange
        var request = new GetNotParticipateBetTypesRequest { MatchId = 1 };
        notParticipateBetTypesService.GetNotParticipateBetType(request.MatchId)
            .ReturnsForAnyArgs(new NotParticipateBetTypesViewModel());

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await notParticipateBetTypesService.Received(1).GetNotParticipateBetType(request.MatchId);
    }
}