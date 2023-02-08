using NSubstitute;
using TicketVoidingSystem.TicketListing.Handlers;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.ViewModels;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Handlers;

public class GetTicketsDetailHandlerTest
{
    [Fact]
    public async Task GetTickets_HasRequest_ReturnTicketsViewModelFromGetTicketsService()
    {
        // Arrange
        var expected = new TicketsViewModel { TotalItems = 123456 };
        var request = new GetTicketsDetailRequest { MatchId = 987654 };
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTickets(default!).ReturnsForAnyArgs(expected);
        var handler = new GetTicketsDetailHandler(getTicketsService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual);
    }
}