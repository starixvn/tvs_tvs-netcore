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
    public class ExportVoidedTicketsHandlerTests
    {
        [Fact]
        public async Task ExportExcel_SetDateTimeNow_ReturnFileNameWithDateTime()
        {
            var request = new ExportVoidedTicketsRequest { RequestId = 12345 };
            var createDate = $"{DateTime.Now:yyyy_MM_dd}";
            var expected = $"Req.{request.RequestId}_TVS_DeleteBet_{createDate}";
            var excelService = Substitute.For<ExcelService<GetVoidedTicketsQuery>>();
            var handler = new ExportVoidedTicketsHandler(excelService);

            // Act
            var model = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.Contains(model.FileName, expected);
        }
    }
}