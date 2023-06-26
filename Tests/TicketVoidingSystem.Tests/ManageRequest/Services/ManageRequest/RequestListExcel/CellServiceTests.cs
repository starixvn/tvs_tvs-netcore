using System.Collections.Generic;
using OfficeOpenXml.Style;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using TicketVoidingSystem.Tests.VoidSingleBet;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel
{
	public class CellServiceTests
	{
		private CellServiceImp cellService;

		public CellServiceTests()
		{
			cellService = new CellServiceImp();
		}

		[Fact]
		public void SetStyle_SetsWorksheetStyleCorrectly()
		{
			// Arrange
			var worksheet = TestSetup.CreateTestingSheet();
			worksheet.Cells[10, 5].Value = "1";

			// Act
			cellService.SetStyle(worksheet);

			// Assert
			Assert.Equal(8, worksheet.Cells[1, 1].Style.Font.Size);
			Assert.Equal("Tahoma", worksheet.Cells[1, 1].Style.Font.Name);
		}

		[Fact]
		public void RenderDataWorksheet_HasRequests_SetDataCorrectly()
		{
			// Arrange
			var worksheet = TestSetup.CreateTestingSheet();
			var lastRow = 10;
			var lasCol = 5;
			worksheet.Cells[lastRow, lasCol].Value = "1";
			var requests = new List<ExcelRequestModel>
			{
				new()
				{
					RequestId = 1,
					NumberOfRequestDetails = 2,
					Index = 1
				}
			};

			// Act
			cellService.RenderDataWorksheet(worksheet, requests);

			// Assert
			Assert.Equal(1, worksheet.Cells[2, 1].GetValue<int>());
			Assert.True(worksheet.Cells[$"A{2}:A{3}"].Merge);
			Assert.Equal(ExcelFillStyle.Solid, worksheet.Cells[$"A{2}:U{3}"].Style.Fill.PatternType = ExcelFillStyle.Solid);
		}
	}
}