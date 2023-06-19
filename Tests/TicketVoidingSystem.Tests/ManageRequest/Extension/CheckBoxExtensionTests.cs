using TicketVoidingSystem.ManageRequest.Models;
using Xunit;
using TicketVoidingSystem.ManageRequest.Extension;
namespace TicketVoidingSystem.Tests.ManageRequest.Extension;

public class CheckBoxExtensionTests
{
    [Theory]
    [InlineData(true, 1)]
    [InlineData(false, -1)]
    public void IsDisable_IsDefaultDisable_ReturnTrue(bool settled, int mainTransId)
    {
        // Arrange
        var item = new GetTicketModel
        {
            TransId = 10001,
            MainTransId = 10002
        };
        var permission = new VoidPermission { Settled = settled };

        // Act
        var result = item.IsDisable(permission, 1);

        // Assert
        Assert.True(result);
    }

    [Theory]
    [InlineData(true, false, true, null, false)]
    [InlineData(false, true, true, null, false)]
    [InlineData(false, false, true, 1, false)]
    [InlineData(false, false, true, null, true)]
    public void IsDisable_ReturnsExpected_WithCheckCancelCashOutTicket
    (bool unSettled, bool instantlySettled, bool settled, int? statusWinLost, bool expected)
    {
        // Arrange
        var item = new GetTicketModel { IsCancelCashOut = true, StatusWinLost = statusWinLost };
        var permission = new VoidPermission { UnSettled = unSettled, InstantlySettled = instantlySettled, Settled = settled };

        // Act
        var result = item.IsDisable(permission, 0);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("(instant settlement)")]
    [InlineData("(instant)")]
    public void IsDisable_ReturnsFalse_WithCheckDefaultEnable(string groupName)
    {
        // Arrange
        var item = new GetTicketModel { GroupName = groupName };
        var permission = new VoidPermission { InstantlySettled = false, Settled = true, UnSettled = true };
        item.Status = "settled";

        // Act
        var result = item.IsDisable(permission, 0);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsDisable_ReturnsFalse_WithCheckCashOutTicketAsUnSettled()
    {
        // Arrange
        var item = new GetTicketModel { GroupName = "1", IsCashOut = true };
        var permission = new VoidPermission { InstantlySettled = false, Settled = false, UnSettled = true };

        // Act
        var result = item.IsDisable(permission, 2);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void IsDisable_ReturnsFalse_WithCheckStatus(bool isMixParlay)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, SubStatus = "123", Status = "123", GroupName = "1", IsCashOut = false };
        var permission = new VoidPermission { InstantlySettled = false, Settled = false, UnSettled = true };

        // Act
        var result = item.IsDisable(permission, 0);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsUncheck_ReturnsTrue_WhenSpecialGroupContainsGroupName()
    {
        // Arrange
        var groupName = "phone betting";

        // Act
        var result = groupName.IsUncheck();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsSettledTicket_ReturnsTrue_WhenCheckStatusConditionMet()
    {
        // Arrange
        var item = new GetTicketModel();
        item.Status = "won";

        // Act
        var result = item.IsSettledTicket();

        // Assert
        Assert.True(result);
    }
}