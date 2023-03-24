using NSubstitute;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.VoidSingleBet.Tests.Handlers;

public class GetLogInfoHandlerTests
{
    [Fact]
    public async Task GetTickets_HaveTicketsDisplay_AssignDataTicket()
    {
        // Arrange
        var request = new GetLogInfoRequest();
        var data = new List<GetTicketModel>
        {
            new()
        };
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        var handler = new GetLogInfoHandler(getTicketsService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await getTicketsService.Received().GetTickets(Arg.Compat.Any<GetTicketsQuery>());
    }

    [Fact]
    public async Task GetTickets_NotHaveAnyTickets_NotUpdateTime()
    {
        // Arrange
        var request = new GetLogInfoRequest();
        var data = new List<GetTicketModel>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        var handler = new GetLogInfoHandler(getTicketsService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(0, actual.TotalItems);
        Assert.Equal(0, actual.TotalItems);
        Assert.Equal(0, actual.TotalItems);
        Assert.Equal(0, actual.TotalItems);
    }
}