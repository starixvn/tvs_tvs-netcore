using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Handlers.MarkUnmarkTickets;

public class MarkAllTicketsHandlerTests
{
    [Fact]
    public async Task MarkAllTickets_ExecuteSucceed_ReturnResult()
    {
        // Arrange
        var expectedResult = new Result { ErrorCode = 0, ErrorMsg = "Unmark tickets successfully!" };
        var markAllTicketsService = Substitute.For<MarkAllTicketsService>();
        markAllTicketsService.Execute(default).ReturnsForAnyArgs(expectedResult);
        var handler = new MarkAllTicketsHandler(markAllTicketsService);

        // Act
        var result = await handler.Handle(new MarkAllTicketsRequest(), CancellationToken.None);

        // Assert
        Assert.Equal(0, result.ErrorCode);
        Assert.Equal("Unmark tickets successfully!", result.ErrorMsg);
        Assert.True(result.IsSuccessful);
    }
}