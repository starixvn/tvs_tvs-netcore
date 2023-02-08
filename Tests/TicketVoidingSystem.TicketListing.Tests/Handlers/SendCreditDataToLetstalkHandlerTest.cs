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
    [InlineData(0)]
    [InlineData(1)]
    public async Task Handle_HasOnlyChinaView_ReturnResult(int errorCode)
    {
        // Arrange
        var result = new Result { ErrorCode = errorCode };
        var request = new SendCreditDataToLetstalkRequest();
        var letstalkService = Substitute.For<NotificationLetstalkService>();
        var excelService = Substitute.For<ExcelService<ExportExcelQuery>>();
        letstalkService.SendToGroupTicketListing(default, default).ReturnsForAnyArgs(result);
        excelService.CreateFileAsByteArray(default!, default).ReturnsForAnyArgs(new byte[] { });

        var handler = new SendCreditDataToLetstalkHandler(excelService, letstalkService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(result.IsSuccessful, actual.IsSuccessful);
    }

    //[Test]
    //public async Task Handle_HasOnlyNormalQuery_ReturnResult()
    //{
    //    // Arrange
    //    var expected = new AmendmentReponse();
    //    var chinaViewQuery = new SendFileQuery { IsChinaView = false };
    //    var request = new SendDataToOicRequest
    //    {
    //        Queries = new[] { chinaViewQuery }
    //    };
    //    var repository = Substitute.For<TicketListingRepository>();
    //    var sendDataToOicService = Substitute.For<SendDataToOicService>();
    //    sendDataToOicService.SendData(new List<SendFileQuery>(), "").ReturnsForAnyArgs(expected);
    //    repository.GetAffectTicketsFromSettlementHistory(false, 1).ReturnsForAnyArgs("");

    //    var handler = new SendDataOicHandler(sendDataToOicService, repository);

    //    // Act
    //    var actual = await handler.Handle(request);

    //    // Assert
    //    AssertExtension.AreEqual(1, actual.Count());
    //}

    //[Test]
    //public async Task Handle_SendDataSuccessfully_ReturnResult()
    //{
    //    // Arrange
    //    var expected = new AmendmentReponse();
    //    var chinaViewQuery = new SendFileQuery { IsChinaView = true };
    //    var normalQuery = new SendFileQuery { IsChinaView = false };
    //    var request = new SendDataToOicRequest
    //    {
    //        Queries = new[] { chinaViewQuery, normalQuery }
    //    };
    //    var sendDataToOicService = Substitute.For<SendDataToOicService>();
    //    var repository = Substitute.For<TicketListingRepository>();
    //    sendDataToOicService.SendData(new List<SendFileQuery>(), "").ReturnsForAnyArgs(expected);
    //    repository.GetAffectTicketsFromSettlementHistory(false, 1).ReturnsForAnyArgs("");

    //    var handler = new SendDataOicHandler(sendDataToOicService, repository);

    //    // Act
    //    var actual = await handler.Handle(request);

    //    // Assert
    //    await sendDataToOicService.Received()
    //        .SendData(Arg.Compat.Any<List<SendFileQuery>>(), Arg.Compat.Any<string>());
    //    AssertExtension.AreEqual(2, actual.Count());
    //}
}