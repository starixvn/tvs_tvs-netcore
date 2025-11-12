using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SubParlayTicket;

public class GetHybridParlayHandlerTests
{
    private readonly GetHybridParlayHandler handler;
    private readonly TicketsService ticketsService;

    public GetHybridParlayHandlerTests()
    {
        ticketsService = Substitute.For<TicketsService>();
        handler = new GetHybridParlayHandler(ticketsService);
    }

    [Fact]
    public async Task Handle_ValidRequest_ReturnsHybridTickets()
    {
        // Arrange
        var request = new GetHybridParlayRequest
        {
            RefNo = "REF123",
            SubTransId = "SUB123",
            Transdesc = "Test Description",
            Hdp1 = 1,
            Hdp2 = 2,
            BetCheck = "CHECK",
            BetTeam = "TEAM",
            Currency = "USD",
            Stake = 100m
        };

        var tickets = new List<TicketModel>
        {
            new()
            {
                TransId = 1,
                BetType = 1,
                HomeId = 10,
                AwayId = 20,
                Hdp1 = 1,
                Hdp2 = 2,
                Odds = 1.5m,
                BetTeam = "TEAM",
                StatusId = 1,
                Status = "Active",
                EventDate = System.DateTime.Now,
                LiveHomeScore = 0,
                LiveAwayScore = 0,
                LiveIndicator = false,
                LeagueId = 1,
                SportType = 1,
                IsNeutral = false,
                MatchId = 1,
                Stake = 100m,
                BetCheck = "CHECK",
                TransDesc = "Test",
                ShowTime = "12:00",
                TransDate = System.DateTime.Now
            }
        };

        var expectedViewModels = new List<TicketViewModel>
        {
            new()
            {
                SubTransId = "SUB123",
                Choice = "Test Choice"
            }
        };

        ticketsService.GetTickets(request.RefNo).Returns(tickets);
        ticketsService.GetHybridTickets(tickets, request).Returns(expectedViewModels);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(expectedViewModels.Count, actual.Count);
        Assert.Equal(expectedViewModels.First().SubTransId, actual.First().SubTransId);
        Assert.Equal(expectedViewModels.First().Choice, actual.First().Choice);
    }
}

