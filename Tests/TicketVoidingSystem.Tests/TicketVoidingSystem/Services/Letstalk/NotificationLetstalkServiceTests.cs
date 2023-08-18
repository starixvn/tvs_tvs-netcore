using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.LetstalkService.Core.Models;
using NSubstitute;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.Letstalk.GroupAbnormalBetRequest;
using TicketVoidingSystem.Services.Letstalk.GroupTicketListing;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using Xunit;
using LetstalkModel = Fanex.LetstalkService.Core.Models.LetstalkModel;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk;

public class NotificationLetstalkServiceTests : AppSettingFixture
{
    private readonly GroupVoidSettledBetService groupVoidSettledBetService;
    private readonly GroupTicketListingService groupTicketListingService;
    private readonly GroupAbnormalBetRequestService groupAbnormalBetRequestService;
    private readonly NotificationLetstalkServiceImp service;

    public NotificationLetstalkServiceTests()
    {
        groupVoidSettledBetService = Substitute.For<GroupVoidSettledBetService>();
        groupTicketListingService = Substitute.For<GroupTicketListingService>();
        groupAbnormalBetRequestService = Substitute.For<GroupAbnormalBetRequestService>();
        service = new NotificationLetstalkServiceImp(groupVoidSettledBetService, groupTicketListingService, groupAbnormalBetRequestService);
    }

    [Fact]
    public async Task SendToGroupVoidSettledBets_ValidRequest_CalledSendMessageWithTicketInfo()
    {
        // Arrange
        var ticketInfo = new TicketInfoForLetstalk();
        var tickets = new List<TicketEmailModel>();

        groupVoidSettledBetService.SendMessageWithTicketInfo(Arg.Any<LetstalkModel>(), Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>())
            .Returns(new List<Models.Result>());

        // Act
        var result = await service.SendToGroupVoidSettledBets(ticketInfo, tickets);

        // Assert
        Assert.Equal(new List<Models.Result>(), result);
        await groupVoidSettledBetService.Received(1).SendMessageWithTicketInfo(Arg.Any<LetstalkModel>(), Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>());
    }

    [Fact]
    public async Task SendToGroupTicketListing_ValidRequest_HasCalledSendMessage()
    {
        // Arrange
        const string content = "content";
        var attachment = new LetstalkAttachment();

        // Act
        _ = await service.SendToGroupTicketListing(content, attachment);

        // Assert
        await groupTicketListingService.Received(1).SendMessage(Arg.Any<LetstalkModel>(), attachment);
    }

    [Fact]
    public async Task SendToGroupAbnormalBetRequest_ValidRequest_ReturnNotImplementedException()
    {
        // Arrange
        var attachment = new LetstalkAttachment();
        var expected = new NotImplementedException();

        // Act
        // Assert
        try
        {
            _ = await service.SendToGroupAbnormalBetRequest("", "", attachment);
        }
        catch (Exception e)
        {
            Assert.Equal(expected.Message, e.Message);
        }
    }
}