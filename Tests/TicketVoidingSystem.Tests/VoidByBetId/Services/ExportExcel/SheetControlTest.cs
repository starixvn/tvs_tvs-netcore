using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.ExportExcel
{

    [Category("VoidByBetId")]
    public class SheetControlTest
    {
        [Fact]
        public async Task Binding_Always_SetStyle()
        {
            // Arrange
            var worksheet = SetupTestingSheet.CreateTestingSheet();
            var model = new GetTicketsQuery { TransIds = "132", InvalidTransIds = "", MovedTransIds = "" };
            var sheetService = Substitute.For<SheetService>();
            sheetService.GetTickets(model).Returns(new List<ExcelTicketModel>());
            var control = new SheetControlImp(sheetService);

            // Act
            await control.BindingContent(worksheet, model);

            // Assert
            sheetService.Received().SetStyle(worksheet);
        }
    }
}