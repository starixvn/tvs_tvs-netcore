using TicketVoidingSystem.MarkTickets.Services.ExportExcel;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.ExportExcel;

public class CellServiceTests
{
    [Fact]
    public void CreateTitle_ReturnExpectedText()
    {
        // Arrange
        var service = new CellServiceImp();

        // Act
        var actual = service.CreateTitle(99);

        // Assert
        Assert.Equal("Mark/ Unmark tickets - MatchId: 99", actual);
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
}