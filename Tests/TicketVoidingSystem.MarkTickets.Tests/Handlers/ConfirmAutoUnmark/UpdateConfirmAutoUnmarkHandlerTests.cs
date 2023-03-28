using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Handlers.ConfirmAutoUnmark;

public class UpdateConfirmAutoUnmarkHandlerTests
{
    [Fact]
    public async Task UpdateConfirmAutoUnmark_ExecuteSucceed_ReturnResult()
    {
        // Arrange
        var expected = new UpdateConfirmAutoUnmarkValidation
        {
            ErrorCode = 0,
            ErrorMsg = "Update auto mark successfully!",
            NegativeBalanceUsers = ""
        };
        var autoUnmarkService = Substitute.For<UpdateConfirmAutoUnmarkService>();
        autoUnmarkService.UpdateConfirmAutoUnmark(default, default)
            .ReturnsForAnyArgs(expected);
        var handler = new UpdateConfirmAutoUnmarkHandler(autoUnmarkService);

        // Act
        var result = await handler.Handle(new UpdateConfirmAutoUnmarkRequest(), CancellationToken.None);

        // Assert
        Assert.Equal(0, result.ErrorCode);
        Assert.Equal(expected.ErrorMsg, result.ErrorMsg);
        Assert.True(result.IsSuccessful);
    }
}