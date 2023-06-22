using System;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.VoidSingleBet.Services.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.ExportExcel;

public class CellServiceTests
{
    [Fact]
    public void CreateTitle_InputMatchId_ReturnTitleWithMatchId()
    {
        // Arrange
        const int matchId = 123;
        const string expected = "Void Single Bet - MatchId: 123";
        var service = new CellServiceImp();

        // Act
        var title = service.CreateTitle(matchId);

        // Assert
        Assert.Equal(expected, title);
    }

    [Fact]
    public void AddMatch_ValidMatchCodeFromMatch_ReturnValueInA5Cells()
    {
        // Arrange
        var worksheet = TestSetup.CreateTestingSheet();
        var match = new Match { MatchCode = "Match Code" };
        var service = new CellServiceImp();

        // Act
        service.AddMatch(worksheet, match);

        // Assert
        Assert.Equal(match.MatchCode, worksheet.Cells["A5"].Value);
    }

    [Fact]
    public void AddMatch_ValidMatchEventFromMatch_ReturnValueInB5Cells()
    {
        // Arrange
        var worksheet = TestSetup.CreateTestingSheet();
        var match = new Match();
        var service = new CellServiceImp();

        // Act
        service.AddMatch(worksheet, match);

        // Assert
        Assert.Equal(match.MatchEvent, worksheet.Cells["B5"].Value);
    }

    [Fact]
    public void AddMatch_ValidEventDateFromMatch_ReturnValueInD5Cells()
    {
        // Arrange
        var worksheet = TestSetup.CreateTestingSheet();
        var match = new Match { EventDate = new DateTime(2017, 5, 25, 9, 20, 40) };
        const string expected = "05/25/2017";
        var service = new CellServiceImp();

        // Act
        service.AddMatch(worksheet, match);

        // Assert
        Assert.Equal(expected, worksheet.Cells["D5"].Value);
    }

    [Fact]
    public void SetStyle_WrapText_ReturnTrue()
    {
        // Arrange
        var sheet = TestSetup.CreateTestingSheet();
        sheet.Cells["A8"].Value = 1;
        var service = new CellServiceImp();

        // Act
        service.SetStyle(sheet);

        // Assert
        Assert.True(sheet.Cells.Style.WrapText);
    }
}