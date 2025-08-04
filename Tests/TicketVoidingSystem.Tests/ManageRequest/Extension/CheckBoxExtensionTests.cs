using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Extension;

public class CheckBoxExtensionTests
{
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void IsDisable_IsDefaultDisable_ReturnTrue(bool settled)
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
    [InlineData(false, false, false, null, true)]
    [InlineData(false, false, false, 1, true)]
    [InlineData(true, true, true, 1, false)]
    [InlineData(true, true, false, 1, true)]
    public void IsDisable_ReturnsExpected_WithCheckCancelCashOutTicket
        (bool unSettled, bool instantlySettled, bool settled, int? statusWinLost, bool expected)
    {
        // Arrange
        var item = new GetTicketModel { IsCancelCashOut = true, StatusWinLost = statusWinLost };
        var permission = new VoidPermission
        { UnSettled = unSettled, InstantlySettled = instantlySettled, Settled = settled };

        // Act
        var result = item.IsDisable(permission, 0);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("(Instant settlement)", true, false, false)]
    [InlineData("(INSTANT settlement)", false, true, false)]
    [InlineData("(instant SETTLEMEMT)", false, false, true)]
    [InlineData("(instant Settlement)", true, true, false)]
    [InlineData("(INSTANT)", true, true, false)]
    public void IsDisable_ReturnsFalse_WithCheckDefaultEnable(string groupName, bool instantlySettled, bool settled,
        bool expected)
    {
        // Arrange
        var item = new GetTicketModel { GroupName = groupName };
        var permission = new VoidPermission { InstantlySettled = instantlySettled, Settled = settled };
        item.Status = "settled";

        // Act
        var result = item.IsDisable(permission, 0);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(true, IssueTypeConstant.AbnormalAccount, true, false, true)]
    [InlineData(true, IssueTypeConstant.ArchivedTicket, true, false, true)]
    [InlineData(true, IssueTypeConstant.AbnormalBet, true, false, true)]
    [InlineData(true, IssueTypeConstant.DangerAccepted, false, false, true)]
    [InlineData(true, IssueTypeConstant.DangerAccepted, true, false, false)]
    [InlineData(true, IssueTypeConstant.DangerAccepted, false, true, false)]
    public void IsDisable_ReturnsFalse_WithCheckCashOutTicketAsUnSettled(bool isCashOut, int issueTypeId,
        bool unSettled, bool instantlySettled, bool expected)
    {
        // Arrange
        var item = new GetTicketModel { GroupName = "1", IsCashOut = isCashOut, Status = TicketStatus.Draw };
        var permission = new VoidPermission
        { InstantlySettled = instantlySettled, Settled = false, UnSettled = unSettled };

        // Act
        var result = item.IsDisable(permission, issueTypeId);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void IsDisable_ReturnsFalse_WithCheckStatus(bool isMixParlay)
    {
        // Arrange
        var item = new GetTicketModel
        { IsMixParlay = isMixParlay, SubStatus = "123", Status = "123", GroupName = "1", IsCashOut = false };
        var permission = new VoidPermission { InstantlySettled = false, Settled = false, UnSettled = true };

        // Act
        var result = item.IsDisable(permission, 0);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void IsDisable_WithBetTypesSaba_WithCheckInstantlySettled(bool instantlySettled)
    {
        // Arrange
        var item = new GetTicketModel
        { BetType = 228, SubStatus = "123", Status = "123", GroupName = "1", IsCashOut = false };
        var permission = new VoidPermission { InstantlySettled = instantlySettled, Settled = false, UnSettled = false };

        // Act
        var result = item.IsDisable(permission, 0);

        // Assert
        Assert.Equal(!instantlySettled, result);
    }

    [Fact]
    public void IsUncheck_ReturnsTrue_WhenSpecialGroupContainsGroupName()
    {
        // Arrange
        const string groupName = "phone betting";

        // Act
        var result = groupName.IsUncheck();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsSettledTicket_ReturnsTrue_WhenCheckStatusConditionMet()
    {
        // Arrange
        var item = new GetTicketModel
        {
            Status = "won"
        };

        // Act
        var result = item.IsSettledTicket();

        // Assert
        Assert.True(result);
    }
}