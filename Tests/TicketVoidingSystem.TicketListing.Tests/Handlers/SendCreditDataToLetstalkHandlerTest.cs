using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Handlers;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Handlers;

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
        var request = new SendCreditDataToLetstalkRequest();
        var letstalkService = Substitute.For<NotificationLetstalkService>();
        var excelService = Substitute.For<ExcelService<ExportExcelQuery>>();
        letstalkService.SendToGroupTicketListing(default, default).ReturnsForAnyArgs(result);
        excelService.GenerateContentAsByteArray(default!, default).ReturnsForAnyArgs(new byte[] { });

        var handler = new SendCreditDataToLetstalkHandler(excelService, letstalkService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(result.IsSuccessful, actual.IsSuccessful);
    }

    //[Fact]
    //public async Task Handle_HasOnlyNormalQuery_ReturnResult()
    //{
    //    // Arrange
    //    var expected = new AmendmentResponse();
    //    var chinaViewQuery = new SendFileQuery { IsChinaView = false };
    //    var request = new SendDataToOicRequest
    //    {
    //        Queries = new[] { chinaViewQuery }
    //    };
    //    var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
    //    var sendDataToOicService = Substitute.For<SendDataToOicService>();
    //    sendDataToOicService.Send(new List<SendFileQuery>(), "").ReturnsForAnyArgs(expected);
    //    affectTicketsFromSettlementHistoryService.GetTickets(false, 1).ReturnsForAnyArgs("");

    //    var handler = new SendDataOicHandler(sendDataToOicService, affectTicketsFromSettlementHistoryService);

    //    // Act
    //    var actual = await handler.Handle(request, CancellationToken.None);

    //    // Assert
    //    Assert.Equal(1, actual.Count);
    //}

    //[Fact]
    //public async Task Handle_SendDataSuccessfully_ReturnResult()
    //{
    //    // Arrange
    //    var expected = new AmendmentResponse();
    //    var chinaViewQuery = new SendFileQuery { IsChinaView = true };
    //    var normalQuery = new SendFileQuery { IsChinaView = false };
    //    var request = new SendDataToOicRequest
    //    {
    //        Queries = new[] { chinaViewQuery, normalQuery }
    //    };
    //    var sendDataToOicService = Substitute.For<SendDataToOicService>();
    //    var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
    //    sendDataToOicService.Send(new List<SendFileQuery>(), "").ReturnsForAnyArgs(expected);
    //    affectTicketsFromSettlementHistoryService.GetTickets(false, 1).ReturnsForAnyArgs("");

    //    var handler = new SendDataOicHandler(sendDataToOicService, affectTicketsFromSettlementHistoryService);

    //    // Act
    //    var actual = await handler.Handle(request, CancellationToken.None);

    //    // Assert
    //    await sendDataToOicService.Received()
    //        .Send(Arg.Any<List<SendFileQuery>>(), Arg.Any<string>());
    //    Assert.Equal(2, actual.Count);
    //}
}