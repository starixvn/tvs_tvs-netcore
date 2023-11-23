using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.LetstalkService.Core.Models;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;

public class GroupVoidSettledBetServiceTests
{
    private readonly LetstalkSingleMessageService letstalkSingleMessageService;
    private readonly LoggingService loggingService;
    private readonly MessageContentSingleService messageContentSingleService;
    private readonly MessageContentWithMemberTemplateService messageContentWithMemberTemplateService;
    private GroupVoidSettledBetServiceImp service;

    public GroupVoidSettledBetServiceTests()
    {
        letstalkSingleMessageService = Substitute.For<LetstalkSingleMessageService>();
        loggingService = Substitute.For<LoggingService>();
        messageContentSingleService = Substitute.For<MessageContentSingleService>();
        messageContentWithMemberTemplateService = Substitute.For<MessageContentWithMemberTemplateService>();
        service = new GroupVoidSettledBetServiceImp(letstalkSingleMessageService, loggingService,
            messageContentSingleService, messageContentWithMemberTemplateService);
    }

    [Fact]
    public async Task SendMessageWithTicketInfo_HasNotTicket_ReturnEmptyResult()
    {
        // Arrange
        var letstalkModel = new LetstalkModel();
        var ticketInfo = new TicketInfoForLetstalk();
        var tickets = new List<TicketEmailModel>();

        // Act
        var results = await service.SendMessageWithTicketInfo(letstalkModel, ticketInfo, tickets);

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public async Task SendMessageWithTicketInfo_HasTicketsIsNull__HasError()
    {
        // Arrange
        var letstalkModel = new LetstalkModel();
        var ticketInfo = new TicketInfoForLetstalk();

        // Act
        var results = await service.SendMessageWithTicketInfo(letstalkModel, ticketInfo, null);
        var result = results.ToList()[0];

        // Assert
        Assert.Equal(ErrorCode.SendLetstalkFail, result.ErrorCode);
    }

    [Fact]
    public async Task SendMessageWithTicketInfo_HasNotContents_ReturnEmptyResult()
    {
        // Arrange
        var letstalkModel = new LetstalkModel();
        var ticketInfo = new TicketInfoForLetstalk { IsMemberTemplate = true };
        var tickets = new List<TicketEmailModel> { new() };
        messageContentWithMemberTemplateService
            .Create(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>())
            .Returns(new List<string>());

        // Act
        var results = await service.SendMessageWithTicketInfo(letstalkModel, ticketInfo, tickets);

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public async Task SendMessageWithTicketInfo_HasSingleMessageContent_HasOneSendLetstalk()
    {
        // Arrange
        var letstalkModel = new LetstalkModel();
        var ticketInfo = new TicketInfoForLetstalk();
        var tickets = new List<TicketEmailModel> { new() };
        messageContentSingleService.Create(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>())
            .Returns("Single Message Content");

        // Act
        _ = await service.SendMessageWithTicketInfo(letstalkModel, ticketInfo, tickets);

        // Assert
        _ = letstalkSingleMessageService.Received(1).Send(Arg.Any<LetstalkModel>(), null);
    }

    [Fact]
    public async Task SendMessageWithTicketInfo_HasException_HasError()
    {
        // Arrange
        var ticketInfo = new TicketInfoForLetstalk { IsMemberTemplate = true };
        var tickets = new List<TicketEmailModel> { new(), new() };
        service = new GroupVoidSettledBetServiceImp(letstalkSingleMessageService, loggingService,
            messageContentSingleService, null);

        // Act
        var results = await service.SendMessageWithTicketInfo(null, ticketInfo, tickets);
        var result = results.ToList()[0];

        // Assert
        Assert.Equal(ErrorCode.SendLetstalkFail, result.ErrorCode);
    }
}