using System.Collections.Generic;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets;


public class NotificationServiceTest
{
    [Fact]
    public void WarningMessage_EmptyIds_ReturnOnlySuccessfulMessage()
    {
        // Arrange
        var format = StringResource.WarningAutoReSettleTransIds;
        var expected = new List<Result>
        {
            new() { ErrorMsg = StringResource.RecoverBetSuccessfully },
            new() { ErrorMsg = StringResource.RecoverTicketReturnRunning }
        };

        var service = new NotificationServiceImp();

        // Act
        var results = service.WarningMessage(format, string.Empty);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    [Fact]
    public void WarningMessage_ValidIds_ReturnSuccessfulAndWarningMessage()
    {
        // Arrange
        var format = StringResource.WarningAutoReSettleTransIds;
        const string ids = "132, 456, 798";
        var expected = new List<Result>
        {
            new() { ErrorMsg = StringResource.RecoverBetSuccessfully },
            new() { ErrorCode = 1, ErrorMsg = string.Format(format, ids) }
        };

        var service = new NotificationServiceImp();

        // Act
        var results = service.WarningMessage(format, ids);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    [Fact]
    public void AddNegativeBalance_EmptyNegativeBalanceUsers_DoNothing()
    {
        // Arrange
        var expected = new List<Result>
        {
            new() { ErrorMsg = StringResource.RecoverTicketReturnRunning }
        };
        var results = new List<Result>
        {
            new() { ErrorMsg = StringResource.RecoverTicketReturnRunning }
        };

        var service = new NotificationServiceImp();

        // Act
        service.AddNegativeBalance(results, string.Empty);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    [Fact]
    public void AddNegativeBalance_ValidNegativeBalanceUsers_AddMessage()
    {
        // Arrange
        const string negativeBalanceUsers = "Test";
        var expected = new List<Result>
        {
            new() { ErrorMsg = StringResource.RecoverTicketReturnRunning },
            new()
            {
                ErrorCode = 1,
                ErrorMsg = string.Format(StringResource.WarningNegativeBalance, negativeBalanceUsers)
            }
        };
        var results = new List<Result>
        {
            new() { ErrorMsg = StringResource.RecoverTicketReturnRunning }
        };

        var service = new NotificationServiceImp();

        // Act
        service.AddNegativeBalance(results, negativeBalanceUsers);

        // Assert
        AssertExtension.Equal(expected, results);
    }
}