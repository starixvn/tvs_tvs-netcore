using System.Collections.Generic;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions;

public class ResultsExtensionTests
{
    [Fact]
    public void InsertNegativeBalanceWarning_NegativeBalanceUsersIsNotEmpty_InsertWarningResult()
    {
        // Arrange
        IList<Result> results = new List<Result>
        {
            new() { ErrorCode = 0, ErrorMsg = "Success" }
        };
        const string negativeBalanceUsers = "User1, User2";

        // Act
        results.InsertNegativeBalanceWarning(negativeBalanceUsers);

        // Assert
        Assert.Equal(2, results.Count);
        Assert.Equal(1, results[1].ErrorCode);
        Assert.Equal(string.Format(StringResource.WarningNegativeBalance, negativeBalanceUsers), results[1].ErrorMsg);
    }

    [Fact]
    public void InsertNegativeBalanceWarning_NegativeBalanceUsersIsNullOrEmpty_NotInsertWarningResult()
    {
        // Arrange
        IList<Result> results = new List<Result>
        {
            new() { ErrorCode = 0, ErrorMsg = "Success" }
        };

        // Act
        results.InsertNegativeBalanceWarning("");

        // Assert
        Assert.Single(results);
    }
}