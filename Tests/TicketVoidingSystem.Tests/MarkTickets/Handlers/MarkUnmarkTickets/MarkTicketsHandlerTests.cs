using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Handlers.MarkUnmarkTickets;

public class MarkTicketsHandlerTests
{
    [Fact]
    public async Task MarkTickets_ExecuteSucceed_ReturnResult()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 1 }
        };
        var request = new MarkTicketsRequest
        {
            Tickets = tickets
        };
        var expectedResult = new Result { ErrorCode = 0, ErrorMsg = "Mark tickets successfully!" };
        var markTicketsService = Substitute.For<MarkTicketsService>();
        markTicketsService.Execute(default).ReturnsForAnyArgs(expectedResult);
        var handler = new MarkTicketsHandler(markTicketsService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(0, result.ErrorCode);
        Assert.True(result.IsSuccessful);
    }
}