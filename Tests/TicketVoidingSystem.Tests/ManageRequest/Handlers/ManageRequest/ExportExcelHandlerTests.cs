using System;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class ExportExcelHandlerTests
    {
        [Fact]
        public async Task ExportExcel_SetDateTimeNow_ReturnFileNameWithDateTime()
        {
            var request = new ExportExcelRequest { RequestId = "12345" };
            var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
            var excelService = Substitute.For<ExcelService<SelectRequestsQuery>>();
            var handler = new ExportExcelHandler(excelService);

            // Act
            var model = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.Contains("Manage_Request_TVS", model.FileName);
        }
    }
}