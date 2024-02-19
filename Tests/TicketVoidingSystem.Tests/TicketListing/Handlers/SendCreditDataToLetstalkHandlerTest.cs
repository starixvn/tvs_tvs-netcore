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
    [InlineData(true, true, "Data of Credit are sent successfully!")]
    [InlineData(true, false, "Failed to send data of Credit site 777!")]
    [InlineData(false, true, "Failed to send data of Credit site Normal!")]
    [InlineData(false, false, "Failed to send data!")]
    public async Task Handle_ReturnMsgExpected(bool isSentDataToSiteNormal, bool isSentDataToSite777, string errorMsg)
    {
        // Arrange
        var tickets = new List<ExcelTicketModel>
        {
            new(){IsSite777 = true, BetId = "1"},
            new(){IsSite777 = false, BetId = "2"}
        };
        var errorCodeSentDataToSiteNormal = isSentDataToSiteNormal ? 0 : 1;
        var errorCodeSentDataToSite777 = isSentDataToSite777 ? 0 : 1;
        var errorMsgSentDataToSiteNormal = isSentDataToSiteNormal ? string.Empty : "Error send Data";
        var errorMsgSentDataToSite777 = isSentDataToSite777 ? string.Empty : "Error send Data";
        var request = new SendCreditDataToLetstalkRequest();
        var letstalkService = Substitute.For<NotificationLetstalkService>();
        var excelService = Substitute.For<ExcelService<ExportExcelQuery>>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTicketsForExportExcel(request).ReturnsForAnyArgs(tickets);
        letstalkService.SendToGroupTicketListing(default, default).ReturnsForAnyArgs(new Result { ErrorCode = errorCodeSentDataToSiteNormal, ErrorMsg = errorMsgSentDataToSiteNormal });
        letstalkService.SendToGroupTicketListing777(default, default).ReturnsForAnyArgs(new Result { ErrorCode = errorCodeSentDataToSite777, ErrorMsg = errorMsgSentDataToSite777 });
        excelService.GenerateContentAsByteArray(default!, default).ReturnsForAnyArgs(new byte[] { });

        var handler = new SendCreditDataToLetstalkHandler(excelService, letstalkService, getTicketsService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(errorMsg, actual.ErrorMsg);
    }

    [Fact]
    public async Task Handle_NoHasTicket_ReturnMsgExpected()
    {
        // Arrange
        var tickets = new List<ExcelTicketModel>();
        var request = new SendCreditDataToLetstalkRequest();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTicketsForExportExcel(request).ReturnsForAnyArgs(tickets);
        const string expected = "Data of Credit are sent successfully!";
        var handler = new SendCreditDataToLetstalkHandler(null, null, getTicketsService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual.ErrorMsg);
    }
}