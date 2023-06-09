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
    private readonly InsertToAmendmentTableStage insertToAmendmentTableStage;
    private readonly CallApiAmendmentStage callApiAmendmentStage;
    private readonly GetTicketsService getTicketsService;
    private readonly SendDataToOicServiceImp service;

    public SendDataToOicServiceImpTest()
    {
        insertToAmendmentTableStage = Substitute.For<InsertToAmendmentTableStage>();
        callApiAmendmentStage = Substitute.For<CallApiAmendmentStage>();
        getTicketsService = Substitute.For<GetTicketsService>();
        service = new SendDataToOicServiceImp(getTicketsService, insertToAmendmentTableStage, callApiAmendmentStage);
    }

    [Fact]
    public async Task SendData_ValidQuery_ReturnAmendmentResponse()
    {
        // Arrange
        var expected = new AmendmentResponse
        {
            Code = 1,
            Message = ""
        };
        var queries = new List<SendFileQuery>
        {
            new() { LicenseeName = "", BetTypeName = "" }
        };
        getTicketsService.GetTicketsForSendDataOic(default!, default!).ReturnsForAnyArgs(new List<ExcelOicModel>());
        insertToAmendmentTableStage.Execute(default!, default!, default!).ReturnsForAnyArgs(true);
        callApiAmendmentStage.Execute(default!, default!, default!).ReturnsForAnyArgs(expected);
        ConfigurationManager.AppSettings["EnvironmentName"] = "LOCAL";

        // Act
        var actual = await service.Send(queries, "");

        // Assert
        await getTicketsService.Received(1).GetTicketsForSendDataOic(Arg.Any<SendFileQuery>(), Arg.Any<string>());
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task SendData_InsertToAmendmentTableFail_ReturnAmendmentResponse()
    {
        // Arrange
        var expected = new AmendmentResponse
        {
            Code = 1,
            Message = "Error when insert to Amendment table."
        };
        var queries = new List<SendFileQuery>
        {
            new() { LicenseeName = "", BetTypeName = "" }
        };
        insertToAmendmentTableStage.Execute(default!, default!, default!).ReturnsForAnyArgs(false);
        ConfigurationManager.AppSettings["EnvironmentName"] = "LOCAL";

        // Act
        var actual = await service.Send(queries, "");

        // Assert
        await getTicketsService.Received(1).GetTicketsForSendDataOic(Arg.Any<SendFileQuery>(), Arg.Any<string>());
        Assert.Equal(expected.Code, actual.Code);
        Assert.Equal(expected.Message, actual.Message);
        Assert.Equal(expected.IsChinaView, actual.IsChinaView);
    }
}