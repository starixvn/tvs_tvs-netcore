using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Handlers;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Handlers;

public class SendDataOicHandlerTest
{
    [Fact]
    public async Task Handle_HasOnlyChinaView_ReturnResult()
    {
        // Arrange
        var expected = new AmendmentResponse();
        var chinaViewQuery = new SendFileQuery { IsChinaView = true };
        var request = new SendDataToOicRequest
        {
            Queries = [chinaViewQuery]
        };
        var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
        var sendDataToOicService = Substitute.For<SendDataToOicService>();
        sendDataToOicService.Send(new List<SendFileQuery>(), "").ReturnsForAnyArgs(expected);
        affectTicketsFromSettlementHistoryService.GetTickets(default, default).ReturnsForAnyArgs("");

        var handler = new SendDataOicHandler(sendDataToOicService, affectTicketsFromSettlementHistoryService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Single(actual);
    }

    [Fact]
    public async Task Handle_HasOnlyJollySport_ReturnResult()
    {
        // Arrange
        var expected = new AmendmentResponse();
        var jollySportQuery = new SendFileQuery { IsChinaView = false, SpecialPlatform = 2 };
        var request = new SendDataToOicRequest
        {
            Queries = [jollySportQuery]
        };
        var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
        var sendDataToOicService = Substitute.For<SendDataToOicService>();
        sendDataToOicService.Send(new List<SendFileQuery>(), "").ReturnsForAnyArgs(expected);
        affectTicketsFromSettlementHistoryService.GetTickets(default, default).ReturnsForAnyArgs("");

        var handler = new SendDataOicHandler(sendDataToOicService, affectTicketsFromSettlementHistoryService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Single(actual);
    }

    [Fact]
    public async Task Handle_HasOnlyNormalQuery_ReturnResult()
    {
        // Arrange
        var expected = new AmendmentResponse();
        var chinaViewQuery = new SendFileQuery { IsChinaView = false };
        var request = new SendDataToOicRequest
        {
            Queries = [chinaViewQuery]
        };
        var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
        var sendDataToOicService = Substitute.For<SendDataToOicService>();
        sendDataToOicService.Send(new List<SendFileQuery>(), "").ReturnsForAnyArgs(expected);
        affectTicketsFromSettlementHistoryService.GetTickets(default, default).ReturnsForAnyArgs("");

        var handler = new SendDataOicHandler(sendDataToOicService, affectTicketsFromSettlementHistoryService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Single(actual);
    }

    [Fact]
    public async Task Handle_SendDataSuccessfully_ReturnResult()
    {
        // Arrange
        var expected = new AmendmentResponse();
        var chinaViewQuery = new SendFileQuery { IsChinaView = true };
        var normalQuery = new SendFileQuery { IsChinaView = false };
        var request = new SendDataToOicRequest
        {
            Queries = [chinaViewQuery, normalQuery]
        };
        var sendDataToOicService = Substitute.For<SendDataToOicService>();
        var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
        sendDataToOicService.Send(new List<SendFileQuery>(), "").ReturnsForAnyArgs(expected);
        affectTicketsFromSettlementHistoryService.GetTickets(false, 1).ReturnsForAnyArgs("");

        var handler = new SendDataOicHandler(sendDataToOicService, affectTicketsFromSettlementHistoryService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await sendDataToOicService.Received()
            .Send(Arg.Any<List<SendFileQuery>>(), Arg.Any<string>());
        Assert.Equal(2, actual.Count);
    }
}