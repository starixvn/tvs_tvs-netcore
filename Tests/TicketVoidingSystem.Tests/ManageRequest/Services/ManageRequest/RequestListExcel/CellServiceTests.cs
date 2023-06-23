using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel
{
    public class CellServiceTests
    {
        //[Fact]
        //public void SetStyle_SetsCorrectStylesOnWorksheet()
        //{
        //    // Arrange
        //    var worksheet = new ExcelWorksheet();
        //    var service = new CellServiceImp();

        //    // Act
        //    service.SetStyle(worksheet);

        //    // Assert
        //    Assert.Equal(8, worksheet.Cells.Style.Font.Size);
        //    Assert.Equal("Tahoma", worksheet.Cells.Style.Font.Name);
        //    Assert.True(worksheet.Cells.Style.WrapText);
        //    Assert.Equal(ExcelBorderStyle.Thin, worksheet.Cells[2, 1, worksheet.Dimension.End.Row, worksheet.Dimension.End.Column].Style.Border.Top.Style);
        //    Assert.Equal(ExcelBorderStyle.Thin, worksheet.Cells[2, 1, worksheet.Dimension.End.Row, worksheet.Dimension.End.Column].Style.Border.Left.Style);
        //    Assert.Equal(ExcelBorderStyle.Thin, worksheet.Cells[2, 1, worksheet.Dimension.End.Row, worksheet.Dimension.End.Column].Style.Border.Right.Style);
        //    Assert.Equal(ExcelBorderStyle.Thin, worksheet.Cells[2, 1, worksheet.Dimension.End.Row, worksheet.Dimension.End.Column].Style.Border.Bottom.Style);
        //    Assert.Equal(ExcelHorizontalAlignment.Right, worksheet.Cells[2, 7, worksheet.Dimension.End.Row, 8].Style.HorizontalAlignment);
        //    Assert.Equal(Color.Red.ToArgb(), worksheet.Cells[$"R2:R{worksheet.Dimension.End.Row}"].Style.Font.Color.Rgb);
        //}
    }
}
