using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;
using Xunit;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;
using TicketVoidingSystem.Tests.VoidSingleBet;
using TicketVoidingSystem.Models;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using System.Drawing;
using Epplus.Mapper.Extensions;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTicketsExcel
{
    public class CellServiceTests
    {
        private CellServiceImp cellService;

        public CellServiceTests()
        {
            cellService = new CellServiceImp();
        }

        [Fact]
        public void AddMatch_ShouldSetMatchInfoInWorksheetCells()
        {
            // Arrange
            var worksheet = TestSetup.CreateTestingSheet();
            var match = new Match
            {
                MatchCode = "ABC123",
                LeagueName = "Premier League",
                EventDate = new DateTime(2022,11,3,5,7,9),
                MatchEvent = "Event"
            };

            const int matchRow = 5;
            const int matchCodeColumn = 1;
            const int leagueNameColumn = 2;
            const int eventTimeColumn = 4;
            const int matchEventColumn = 3;

            // Act
            cellService.AddMatch(worksheet, match);

            // Assert
            Assert.Equal(worksheet.Cells[matchRow, matchCodeColumn].Value, match.MatchCode);
            Assert.Equal(worksheet.Cells[matchRow, leagueNameColumn].Value, match.LeagueName);
            Assert.Equal(worksheet.Cells[matchRow, eventTimeColumn].Value, match.EventDate.ToString(FormatKey.ShortDateFormatWithSlash));
            Assert.Equal(worksheet.Cells[matchRow, matchEventColumn].Value, match.MatchEvent);
        }

        [Fact]
        public void CreateTitle_ShouldReturnCorrectTitleString()
        {
            // Arrange
            int matchId = 123;

            // Act
            string title = cellService.CreateTitle(matchId);

            // Assert
            Assert.Equal($"Void Bet - MatchId: {matchId}", title);
        }

        //[Fact]
        //public void WriteGroupHeader_ShouldSetStyleAndValueForHeaderRange()
        //{
        //    // Arrange
        //    var worksheet = TestSetup.CreateTestingSheet();
        //    var group = new Group<ExcelVoidedTicketModel>
        //    {
        //        Name = "Group 1",
        //        Tickets = new List<ExcelVoidedTicketModel> { /* Initialize ExcelVoidedTicketModel instances */ }
        //    };
        //    int rowNumber = 8;

        //    // Act
        //    cellService.WriteGroupHeader(worksheet, rowNumber, group);

        //    // Assert
        //    const int fontSize = 8;
        //    var expectedRange = worksheet.Cells[$"A{rowNumber}:O{rowNumber}"];
        //    expectedRange.Received(1).Merge = true;
        //    expectedRange.Received(1).Style.Fill.PatternType = ExcelFillStyle.Solid;
        //    expectedRange.Received(1).Style.Fill.BackgroundColor.SetColor(Color.LightGray);
        //    expectedRange.Received(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        //    expectedRange.Received(1).Style.Font.Bold = true;
        //    expectedRange.Received(1).Style.Font.Name = "Tahoma";
        //    expectedRange.Received(1).Style.Font.Size = fontSize;
        //    expectedRange.Received(1).Value = $"{group.Name} ({group.Tickets.Count()})";
        //}

        //[Fact]
        //public void SetStyle_ShouldSetStyleForWorksheetCells()
        //{
        //    // Arrange
        //    var worksheet = TestSetup.CreateTestingSheet();
        //    worksheet.Dimension.End.Row = 1;
        //    // Act
        //    cellService.SetStyle(worksheet);

        //    // Assert
        //    worksheet.Cells.Style.Received(1).WrapText = true;
        //    var lastRow = worksheet.Dimension.End.Row;
        //    worksheet.Received(1).HighlightBackground($"A8:O{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        //    worksheet.Received(1).HighlightFont($"F8:F{lastRow}", "LEFT(F8,1)=\"-\"", Color.Red);
        //}
    }
}
