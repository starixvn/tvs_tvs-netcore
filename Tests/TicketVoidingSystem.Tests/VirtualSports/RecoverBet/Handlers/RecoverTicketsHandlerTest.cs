using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.RecoverBet.Handlers;
using SpecialDelete.VirtualSports.RecoverBet.Services;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Handlers;


public class RecoverTicketsHandlerTest
{
    [Fact]
    public async Task VoidTickets_HasRequest_ReturnResultsFromVoidByCurrencyService()
    {
        // Arrange
        var expected = new List<Result> { new() { ErrorCode = 0, ErrorMsg = "Recover Bet Successful" } };
        var request = new RecoverTicketsRequest { MatchId = 123465, TransIds = "132,465,79,4897" };
        var service = Substitute.For<RecoverBetService>();
        service.RecoverTickets(request).ReturnsForAnyArgs(expected);
        var handler = new RecoverTicketsHandler(service);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}