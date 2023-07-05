using OfficeOpenXml.Style;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.ExportExcel;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Tests.VoidSingleBet;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest.ExportExcel
{
    public class CellServiceTests
    {
        private CellServiceImp cellService;

        public CellServiceTests()
        {
            cellService = new CellServiceImp();
        }

        [Fact]
        public void CreateTitle_HasMatchId_ReturnTitle()
        {
            // Arrange
            var expected = "Void Bet - MatchId: 1";

            // Act
            var actual = cellService.CreateTitle(1);

            // Assert
            Assert.Equal(expected, actual);
        }

        [Fact]
        public void AddMatch_HasMatchValue_UpdateWorksheet()
        {
            // Arrange
            var worksheet = SetupTestingSheet.CreateTestingSheet();
            var match = new Match
            {
                MatchCode = "1",
                LeagueName = "a",
                MatchEvent = "b"
            };

            // Act
            cellService.AddMatch(worksheet, match);

            // Assert
            Assert.Equal(match.MatchCode, worksheet.Cells[5, 1].Value);
            Assert.Equal(match.LeagueName, worksheet.Cells[5, 2].Value);
            Assert.Equal(match.MatchEvent, worksheet.Cells[5, 3].Value);
            Assert.Equal(string.Empty, worksheet.Cells[5, 4].Value);
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void SetStyle_CheckIsNumberGame_HighLightFontRightColumn(bool isNumberGame)
        {
            // Arrange
            var worksheet = SetupTestingSheet.CreateTestingSheet();
            worksheet.Cells["H8"].Value = -200;
            worksheet.Cells["G8"].Value = -200;

            // Act
            cellService.SetStyle(worksheet, isNumberGame);

            // Assert
            Assert.True(worksheet.Cells.Style.WrapText);
        }

        [Fact]
        public void WriteGroupHeader_SetsStylePropertiesCorrectly()
        {
            // Arrange
            var worksheet = SetupTestingSheet.CreateTestingSheet();
            var rowNumber = 1;

            // Act
            cellService.WriteGroupHeader(worksheet, rowNumber, "a", 1);

            // Assert
            var headerRange = worksheet.Cells[$"A{rowNumber}:O{rowNumber}"];
            var headerStyle = headerRange[1, 1].Style;
            Assert.Equal(8, headerRange.Style.Font.Size);
            Assert.Equal(ExcelFillStyle.Solid, headerRange.Style.Fill.PatternType);
            Assert.Equal(ExcelHorizontalAlignment.Left, headerRange.Style.HorizontalAlignment);
            Assert.Equal("Tahoma", headerRange.Style.Font.Name);
            Assert.Equal("a (1)", headerRange.Value);
            Assert.True(headerStyle.Font.Bold);
        }
    }
}
