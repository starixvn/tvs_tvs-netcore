using NSubstitute;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services.GetTickets;

public class CheckBoxServiceTest
{
    [Theory]
    [InlineData(123, 123, true)]
    [InlineData(0, 1234, true)]
    [InlineData(123, 1234, true)]
    public void IsDisable_HasMainCashOutIdThatNotEqualToTransId_ReturnTrue(long mainTransId, long transId, bool expected)
    {
        // Arrange
        var ticket = new GetTicketModel { IsCashOut = true, MainTransId = mainTransId, TransId = transId, SubStatus = string.Empty };
        var validationService = Substitute.For<ValidationService>();
        var service = new CheckBoxServiceImp(validationService);

        // Act
        var actual = service.IsDisable(ticket, new UserPermission());

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsDisable_SingleTicket_CheckByPermissionWithStatus()
    {
        // Arrange
        var ticket = new GetTicketModel { IsMixParlay = false, Status = "Main", SubStatus = "Sub" };
        var validationService = Substitute.For<ValidationService>();
        validationService
            .DisableCheckboxWithPermission(ticket.Status, Arg.Any<UserPermission>(), Arg.Any<string>())
            .ReturnsForAnyArgs(true);
        var service = new CheckBoxServiceImp(validationService);

        // Act
        var actual = service.IsDisable(ticket, new UserPermission());

        // Assert
        Assert.True(actual);
    }

    [Fact]
    public void IsDisable_ParlayTicket_CheckByPermissionWithSubStatus()
    {
        // Arrange
        var ticket = new GetTicketModel { IsMixParlay = true, Status = "Main", SubStatus = "Sub" };
        var validationService = Substitute.For<ValidationService>();
        validationService
            .DisableCheckboxWithPermission(ticket.SubStatus, Arg.Any<UserPermission>(), Arg.Any<string>())
            .ReturnsForAnyArgs(true);
        var service = new CheckBoxServiceImp(validationService);

        // Act
        var actual = service.IsDisable(ticket, Arg.Any<UserPermission>());

        // Assert
        Assert.True(actual);
    }

    [Fact]
    public void IsDisable_SettledParlayTicket_ReturnTrue()
    {
        // Arrange
        var ticket = new GetTicketModel { IsMixParlay = true, Status = "running", SubStatus = "Won" };
        var validationService = Substitute.For<ValidationService>();
        var service = new CheckBoxServiceImp(validationService);

        // Act
        var actual = service.IsDisable(ticket, Arg.Any<UserPermission>());

        // Assert
        Assert.False(actual);
    }
}