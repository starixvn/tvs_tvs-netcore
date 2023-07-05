using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Services.MarkUnmarkTickets;

public class CheckBoxServiceTests
{
    [Fact]
    public void IsDisable_WithPermission_ReturnTrue()
    {
        // Arrange
        var permission = new UserPermission { MarkTickets = false };
        var service = new CheckBoxServiceImp();

        // Act
        var actual = service.IsDisable(new GetTicketModel(), permission);

        // Assert
        Assert.True(actual);
    }

    [Theory]
    [InlineData(0, 1, false)]
    [InlineData(1, 1, false)]
    [InlineData(1, 2, true)]
    public void IsDisable_WithTicket_ReturnTrueOrFalse(int mainTransId, int transId, bool expected)
    {
        //Arrange
        var ticket = new GetTicketModel { MainTransId = mainTransId, TransId = transId };
        var permission = new UserPermission { MarkTickets = true };
        var service = new CheckBoxServiceImp();

        // Act
        var actual = service.IsDisable(ticket, permission);

        // Assert
        Assert.Equal(expected, actual);
    }
}