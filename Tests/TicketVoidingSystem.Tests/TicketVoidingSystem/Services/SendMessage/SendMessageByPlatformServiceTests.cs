using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendMessage;

public class SendMessageByPlatformServiceTests
{
    [Fact]
    public async Task Execute_HasNormalAndSpecialTickets_CallExpected()
    {
        // Arrange
        var param = new SendMessageTargetParam
        {
            Message = new Message(),
            EmailTickets = new List<TicketEmailModel>
            {
                new(){TransId = 1},
                new(){TransId = 2}
            },
            Match = new Match { LeagueGroupId = 1 },
            IsSendMessageToAdminSite = true
        };
        var normalTickets = new List<TicketEmailModel>
        {
            new() { TransId = 1 }
        };
        var specialPlatformTickets = new List<TicketEmailModel>
        {
            new() { TransId = 2 }
        };
        const int normalMessageId = 1;
        var specialMessage = new Message();
        var specialPlatformService = Substitute.For<SpecialPlatformService>();
        var sendMessageService = Substitute.For<SendMessageService>();
        var sessionService = Substitute.For<SessionService>();
        const int specialMessageId = 2;
        const int reasonId = 3;
        specialPlatformService.GroupTicketSaba(param.EmailTickets).ReturnsForAnyArgs((normalTickets, specialPlatformTickets));
        sendMessageService.InsertMessage(param.Message, param.MatchId, param.Match.LeagueGroupId, param.IsMessageContentAbnormal).Returns(normalMessageId);
        specialPlatformService.RemoveSabaInMessageContent(param.Match, param.Message).ReturnsForAnyArgs(specialMessage);
        sendMessageService.InsertMessage(specialMessage, 0, param.Match.LeagueGroupId, param.IsMessageContentAbnormal).Returns(specialMessageId);
        sendMessageService.InsertReason(param.Reason, param.ReasonSC).ReturnsForAnyArgs(reasonId);
        var service = new SendMessageByPlatformServiceImp(specialPlatformService, sendMessageService, sessionService);

        // Act
        _ = service.Execute(param);

        // Assert
        await sendMessageService.Received(1).InsertMessageIntoAdminSite(param.Message);
        await sendMessageService.Received(1).InsertMessage(param.Message, param.MatchId, param.Match.LeagueGroupId, param.IsMessageContentAbnormal);
        await sendMessageService.Received(1).InsertMessage(specialMessage, 0, param.Match.LeagueGroupId, param.IsMessageContentAbnormal);
        await sendMessageService.Received(1).InsertReason(param.Reason, param.ReasonSC);
        await sendMessageService.Received(1).SendMessage(normalTickets, normalMessageId, param.IssueTypeId, param.Message.CreatorId);
        await sendMessageService.Received(1).SendMessage(specialPlatformTickets, specialMessageId, param.IssueTypeId, specialMessage.CreatorId);
        await sendMessageService.Received(2).InsertVoidedTransaction(Arg.Any<InsertVoidedTransactionParam>());
    }

    [Fact]
    public async Task Execute_HasOnlyNormalTickets_CallExpected()
    {
        // Arrange
        var param = new SendMessageTargetParam
        {
            Message = new Message(),
            EmailTickets = new List<TicketEmailModel>
            {
                new(){TransId = 1}
            },
            IsMessageContentAbnormal = false
        };
        var normalTickets = new List<TicketEmailModel>
        {
            new() { TransId = 1 }
        };
        var specialPlatformTickets = new List<TicketEmailModel>();
        const int normalMessageId = 1;
        var specialPlatformService = Substitute.For<SpecialPlatformService>();
        var sendMessageService = Substitute.For<SendMessageService>();
        var sessionService = Substitute.For<SessionService>();
        const int reasonId = 3;
        specialPlatformService.GroupTicketSaba(param.EmailTickets).ReturnsForAnyArgs((normalTickets, specialPlatformTickets));
        sendMessageService.InsertMessage(param.Message, param.MatchId, 0, param.IsMessageContentAbnormal).Returns(normalMessageId);
        sendMessageService.InsertReason(param.Reason, param.ReasonSC).ReturnsForAnyArgs(reasonId);
        var service = new SendMessageByPlatformServiceImp(specialPlatformService, sendMessageService, sessionService);

        // Act
        _ = service.Execute(param);

        // Assert
        await sendMessageService.Received(1).InsertMessage(Arg.Any<Message>(), 0, null, param.IsMessageContentAbnormal);
        await sendMessageService.Received(1).InsertReason(param.Reason, param.ReasonSC);
        await sendMessageService.Received(1).SendMessage(Arg.Any<IEnumerable<TicketEmailModel>>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<int>());
    }

    [Fact]
    public async Task Execute_HasOnlySpecialTickets_CallExpected()
    {
        // Arrange
        var param = new SendMessageTargetParam
        {
            Message = new Message(),
            EmailTickets = new List<TicketEmailModel>
            {
                new(){TransId = 1}
            },
            IsMessageContentAbnormal = false,
            Reason = "Reason",
            ReasonSC = "ReasonSC"
        };
        var normalTickets = new List<TicketEmailModel>();
        var specialPlatformTickets = new List<TicketEmailModel>
        {
            new() { TransId = 1 }
        };
        var specialPlatformService = Substitute.For<SpecialPlatformService>();
        var sendMessageService = Substitute.For<SendMessageService>();
        var sessionService = Substitute.For<SessionService>();
        const int reasonId = 3;
        var specialMessage = new Message();
        specialPlatformService.RemoveSabaInMessageContent(param.Match, param.Message).ReturnsForAnyArgs(specialMessage);
        specialPlatformService.GroupTicketSaba(param.EmailTickets).ReturnsForAnyArgs((normalTickets, specialPlatformTickets));
        sendMessageService.InsertMessage(Arg.Any<Message>(), Arg.Any<int>(), Arg.Any<int>(), param.IsMessageContentAbnormal).ReturnsForAnyArgs(2);
        sendMessageService.InsertReason(param.Reason, param.ReasonSC).ReturnsForAnyArgs(reasonId);
        var service = new SendMessageByPlatformServiceImp(specialPlatformService, sendMessageService, sessionService);

        // Act
        _ = service.Execute(param);

        // Assert
        await sendMessageService.Received(1).InsertMessage(Arg.Any<Message>(), 0, null, param.IsMessageContentAbnormal);
        await sendMessageService.Received(1).InsertReason(param.Reason, param.ReasonSC);
        await sendMessageService.Received(1).SendMessage(Arg.Any<IEnumerable<TicketEmailModel>>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<int>());
    }
}