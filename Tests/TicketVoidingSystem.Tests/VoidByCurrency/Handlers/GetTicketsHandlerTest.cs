using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Handlers;
using SpecialDelete.VoidByCurrency.Services;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Handlers;

public class GetTicketsHandlerTest
{
    [Fact]
    public async Task GetTickets_HasRequest_ReturnTicketsFromVoidByCurrencyService()
    {
        // Arrange
        var expected = new TicketsViewModel
        {
            Groups =
            [
                new Group<TicketViewModel>
                {
                    Name = "TEST",
                    Tickets = new List<TicketViewModel> { new() { BetId = "696969" } }
                }
            ],
            TotalItems = 69
        };
        var request = new GetTicketsRequest { MatchId = 12369 };
        var voidByCurrencyService = Substitute.For<VoidByCurrencyService>();
        voidByCurrencyService.GetTickets(request).ReturnsForAnyArgs(expected);
        var handler = new GetTicketsHandler(voidByCurrencyService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}