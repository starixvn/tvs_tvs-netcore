using System.Configuration;
using NSubstitute;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Services.SendDataOic;

public class SendDataToOicServiceImpTest
{
    [Fact]
    public async Task SendData_ValidQuery_ReturnAmendmentResponse()
    {
        // Arrange
        var expected = new AmendmentReponse
        {
            Code = 1,
            Message = ""
        };
        var queries = new List<SendFileQuery>
        {
            new() { LicenseeName = "", BetTypeName = "" }
        };
        var insertToAmendmentTableStage = Substitute.For<InsertToAmendmentTableStage>();
        var callApiAmendmentStage = Substitute.For<CallApiAmendmentStage>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTicketsForSendDataOic(default!, default!).ReturnsForAnyArgs(new List<ExcelOicModel>());
        insertToAmendmentTableStage.Execute(default!, default!, default!).ReturnsForAnyArgs(true);
        callApiAmendmentStage.Execute(default!, default!, default!).ReturnsForAnyArgs(expected);
        ConfigurationManager.AppSettings["EnvironmentName"] = "LOCAL";
        var service = new SendDataToOicServiceImp(getTicketsService, insertToAmendmentTableStage, callApiAmendmentStage);

        // Act
        var actual = await service.Send(queries, "");

        // Assert
        await getTicketsService.Received(1).GetTicketsForSendDataOic(Arg.Compat.Any<SendFileQuery>(), Arg.Compat.Any<string>());
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task SendData_InsertToAmendmentTableFail_ReturnAmendmentResponse()
    {
        // Arrange
        var expected = new AmendmentReponse
        {
            Code = 1,
            Message = "Error when insert to Amendment table."
        };
        var queries = new List<SendFileQuery>
        {
            new() { LicenseeName = "", BetTypeName = "" }
        };
        var insertToAmendmentTableStage = Substitute.For<InsertToAmendmentTableStage>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        insertToAmendmentTableStage.Execute(default!, default!, default!).ReturnsForAnyArgs(false);
        ConfigurationManager.AppSettings["EnvironmentName"] = "LOCAL";

        var service = new SendDataToOicServiceImp(getTicketsService, insertToAmendmentTableStage, null!);

        // Act
        var actual = await service.Send(queries, "");

        // Assert
        await getTicketsService.Received(1).GetTicketsForSendDataOic(Arg.Compat.Any<SendFileQuery>(), Arg.Compat.Any<string>());
        Assert.Equal(expected.Code, actual.Code);
        Assert.Equal(expected.Message, actual.Message);
        Assert.Equal(expected.IsChinaView, actual.IsChinaView);
    }
}