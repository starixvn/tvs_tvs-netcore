using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Handlers;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Handlers;

public class SendCreditDataToLetstalkHandlerTest
{
    [Theory]
    [InlineData(0, "")]
    [InlineData(1, "Fail")]
    public async Task Handle_ReturnResult(int errorCode, string errorMsg)
    {
        // Arrange
        var result = new Result
        {
            ErrorCode = errorCode,
            ErrorMsg = errorMsg
        };
        var tickets = new List<ExcelTicketModel>
        {
            new(){Site = "777", BetId = "1"},
            new(){Site = "1", BetId = "2"}
        };
        var request = new SendCreditDataToLetstalkRequest();
        var letstalkService = Substitute.For<NotificationLetstalkService>();
        var excelService = Substitute.For<ExcelService<ExportExcelQuery>>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTicketsForExportExcel(request).ReturnsForAnyArgs(tickets);
        letstalkService.SendToGroupTicketListing(default, default).ReturnsForAnyArgs(result);
        excelService.GenerateContentAsByteArray(default!, default).ReturnsForAnyArgs(new byte[] { });

        var handler = new SendCreditDataToLetstalkHandler(excelService, letstalkService, getTicketsService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(result.IsSuccessful, actual.IsSuccessful);
    }
}