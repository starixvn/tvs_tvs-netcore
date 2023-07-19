using System;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;
using TicketVoidingSystem.Models;
using OfficeOpenXml.Style;
using OfficeOpenXml;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTicketsExcel
{
	public class CellServiceTests
	{
		private readonly CellServiceImp cellService;

		public CellServiceTests()
		{
			cellService = new CellServiceImp();
		}

		[Fact]
		public void AddMatch_ShouldSetMatchInfoInWorksheetCells()
		{
			// Arrange
			var worksheet = SetupTestingSheet.CreateTestingSheet();
			var match = new Match
			{
				MatchCode = "ABC123",
				LeagueName = "Premier League",
				EventDate = new DateTime(2022, 11, 3, 5, 7, 9),
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
			const int matchId = 123;

			// Act
			var title = cellService.CreateTitle(matchId);

			// Assert
			Assert.Equal($"Void Bet - MatchId: {matchId}", title);
		}

		[Fact]
		public void WriteGroupHeader_SetsStylePropertiesCorrectly()
		{
			// Arrange
			var worksheet = SetupTestingSheet.CreateTestingSheet();
			const int rowNumber = 1;
			var group = new Group<ExcelVoidedTicketModel>();

			// Act
			cellService.WriteGroupHeader(worksheet, rowNumber, group);

			// Assert
			var headerRange = worksheet.Cells[$"A{rowNumber}:O{rowNumber}"];
			var headerStyle = headerRange[1, 1].Style;

			Assert.Equal(ExcelFillStyle.Solid, headerStyle.Fill.PatternType);
			Assert.True(headerStyle.Font.Bold);
		}

		[Fact]
		public void SetStyle_WithValidWorksheet_SetsStylesCorrectly()
		{
			// Arrange
			ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
			var package = new ExcelPackage();
			var sheet = package.Workbook.Worksheets.Add("Template");
			sheet.Cells[10, 10].Value = "Value";

			// Act
			cellService.SetStyle(sheet);

			// Assert
			Assert.True(sheet.Cells.Style.WrapText);
		}
	}
}