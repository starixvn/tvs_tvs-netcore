using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Handlers;
using SpecialDelete.VirtualSports.RecoverBet.Services;
using SpecialDelete.VirtualSports.RecoverBet.ViewModels;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Handlers;


public class GetTicketsHandlerTest
{
    [Fact]
    public async Task GetTickets_HasRequest_ReturnTicketsFromRecoverBetService()
    {
        // Arrange
        var expected = new RecoverTicketsViewModel
        {
            Groups = new List<Group<TicketViewModel>>
            {
                new()
                {
                    Name = "TEST",
                    Tickets = new List<TicketViewModel> { new() { BetId = "696969" } }
                }
            },
            InvalidTransIds = string.Empty,
            MovedTransIds = string.Empty
        };
        var request = new GetTicketsRequest { MatchId = 12369 };
        var service = Substitute.For<RecoverBetService>();
        service.GetTickets(request).ReturnsForAnyArgs(expected);
        var handler = new GetTicketsHandler(service);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}