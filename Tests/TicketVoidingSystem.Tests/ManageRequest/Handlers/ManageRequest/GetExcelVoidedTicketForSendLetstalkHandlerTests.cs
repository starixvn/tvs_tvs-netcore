using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class GetExcelVoidedTicketForSendLetstalkHandlerTests
    {
        [Fact]
        public async Task Handle_ValidRequest_HasCallCreateFileAsByteArray()
        {
            var request = new GetExcelVoidedTicketForSendLetstalkRequest { RequestId = 12345 };
            var excelService = Substitute.For<ExcelService<GetVoidedTicketsQuery>>();
            var handler = new GetExcelVoidedTicketForSendLetstalkHandler(excelService);
            byte[] expected = {};
            excelService.GenerateContentAsByteArray(request, TemplateExcelPath.TicketVoiding_VoidedTickets).ReturnsForAnyArgs(expected);
            // Act
            var model = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.Equal(request.IsCreditOnly, true);
            await excelService.Received().GenerateContentAsByteArray(Arg.Any<GetExcelVoidedTicketForSendLetstalkRequest>(), TemplateExcelPath.TicketVoiding_VoidedTickets);
        }
    }
}