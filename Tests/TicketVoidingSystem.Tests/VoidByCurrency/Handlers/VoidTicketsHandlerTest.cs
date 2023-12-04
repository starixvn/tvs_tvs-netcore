using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Handlers;
using SpecialDelete.VoidByCurrency.Services;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Handlers;

public class VoidTicketsHandlerTest
{
    [Fact]
    public async Task VoidTickets_HasRequest_ReturnResultsFromVoidByCurrencyService()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var expected = new List<Result> { new() { ErrorCode = 0, ErrorMsg = "Void Bet Successful" } };
        var request = new VoidTicketsRequest { MatchId = 123465, Tickets = tickets };
        var voidByCurrencyService = Substitute.For<VoidByCurrencyService>();
        voidByCurrencyService.VoidBet(request).Returns(expected);
        var handler = new VoidTicketsHandler(voidByCurrencyService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}