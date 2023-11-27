using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.ExportExcel;

public class CellServiceTests
{
    private readonly CellServiceImp cellService = new();

    [Fact]
    public void SetStyle_UpdateExpected()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        worksheet.Cells[10, 5].Value = "1";
        worksheet.Cells["R2:R2"].Value = RemarkConstant.InvalidTicket;
        // Act
        cellService.SetStyle(worksheet);

        // Assert
        Assert.True(worksheet.Cells.Style.WrapText);
        Assert.Equal(8, worksheet.Cells.Style.Font.Size);
        Assert.Equal("Tahoma", worksheet.Cells.Style.Font.Name);
    }
}