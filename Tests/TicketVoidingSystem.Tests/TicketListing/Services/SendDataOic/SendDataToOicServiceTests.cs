using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Services.SendDataOic;

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
    public async Task SendData_HasSendFileQuery_ReturnAmendmentResponse()
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
        getTicketsService.GetTicketsForSendDataOic(null!, null!).ReturnsForAnyArgs(new ExcelOicModel());
        insertToAmendmentTableStage.Execute(null!, null!).ReturnsForAnyArgs(new List<LicenseeFile>());
        callApiAmendmentStage.Execute(null!, null!, default!).ReturnsForAnyArgs(expected);
        ConfigurationManager.AppSettings["EnvironmentName"] = "LOCAL";

        // Act
        var actual = await service.Send(queries, "");

        // Assert
        await getTicketsService.Received(1).GetTicketsForSendDataOic(Arg.Any<SendFileQuery>(), Arg.Any<string>());
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task SendData_NoHasSendFileQuery_ReturnAmendmentResponse()
    {
        // Arrange
        var expected = new AmendmentResponse
        {
            Code = 1,
            Message = ""
        };
        var queries = new List<SendFileQuery>();
        getTicketsService.GetTicketsForSendDataOic(null!, null!).ReturnsForAnyArgs(new ExcelOicModel());
        insertToAmendmentTableStage.Execute(null!, null!).ReturnsForAnyArgs(new List<LicenseeFile>());
        callApiAmendmentStage.Execute(null!, null!, default!).ReturnsForAnyArgs(expected);
        ConfigurationManager.AppSettings["EnvironmentName"] = "LOCAL";

        // Act
        var actual = await service.Send(queries, "");

        // Assert
        await getTicketsService.Received(1).GetTicketsForSendDataOic(Arg.Any<SendFileQuery>(), Arg.Any<string>());
        Assert.Equal(expected, actual);
    }
}