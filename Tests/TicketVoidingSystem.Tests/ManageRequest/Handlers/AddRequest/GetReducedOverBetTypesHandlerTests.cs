using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetReducedOverBetTypesHandlerTests
{
    private readonly GetReducedOverBetTypesHandler handler;
    private readonly ReducedOverBetTypesService reducedOverBetTypesService;

    public GetReducedOverBetTypesHandlerTests()
    {
        reducedOverBetTypesService = Substitute.For<ReducedOverBetTypesService>();
        handler = new GetReducedOverBetTypesHandler(reducedOverBetTypesService);
    }

    [Fact]
    public async Task Handler_Successful_HasCallExpected()
    {
        // Arrange
        var request = new GetReducedOverBetTypesRequest { MatchId = 1 };
        reducedOverBetTypesService.GetBetTypes(request.MatchId)
            .ReturnsForAnyArgs(new List<ReducedOverBetTypesModel>());

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await reducedOverBetTypesService.Received(1).GetBetTypes(request.MatchId);
    }
}