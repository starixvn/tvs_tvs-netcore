using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using SpecialDelete.NumberGame.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Services.VoidTickets;


public class VoidServiceTest
{
    [Fact]
    public static async Task VoidTickets_Successfully_ReturnTicketsFromRepository()
    {
        // Arrange
        var expected = new List<TicketEmailModel> { new() { TransId = 123 } };
        var repository = Substitute.For<Repository>();
        repository.VoidTickets(new VoidTicketsQuery()).ReturnsForAnyArgs((expected, new Result()));
        var service = CreateService(repository);

        // Act
        var actual = await service.VoidTickets(new VoidTicketsQuery { UserPwd = "asff" });

        // Assert
        AssertExtension.Equal(expected, actual.Tickets);
    }

    [Fact]
    public static async Task VoidTickets_ThrowException_UpdateErrorIntoCriteria()
    {
        // Arrange
        var exception = new Exception("Void tickets failed!");
        var query = new VoidTicketsQuery { UserPwd = "pass" };
        var repository = Substitute.For<Repository>();
        repository.VoidTickets(new VoidTicketsQuery())
            .ReturnsForAnyArgs(async x => throw exception);
        var service = CreateService(repository);

        // Act
        var (_, validations) = await service.VoidTickets(query);

        // Assert
        Assert.Equal(ErrorCode.ExecuteQueryFail, validations.ErrorCode);
        Assert.Equal("Void tickets failed!", validations.ErrorMsg);
    }

    [Fact]
    public static async Task SendMessage_Successful_CallExpectedMessageService()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            UserName = "sa",
            Message = new Message { ContentEnglish = "Content english", CreatorId = 123 },
            MatchId = 111,
            Reason = "Reason",
            ReasonSC = "ReasonSC"
        };
        var tickets = new List<TicketEmailModel>();
        const int messageId = 12345;
        const int reasonId = 111;
        var messageService = Substitute.For<SendMessageService>();
        messageService.InsertMessage(Arg.Any<Message>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<bool>()).ReturnsForAnyArgs(messageId);
        messageService.InsertReason(Arg.Any<string>(), Arg.Any<string>()).ReturnsForAnyArgs(reasonId);
        var service = CreateService(messageService);

        // Act
        await service.SendMessage(query, tickets);

        // Assert
        await messageService.Received(1).InsertMessage(Arg.Is<Message>(x => x.ContentEnglish == "Content english"), 111, null, false);
        await messageService.Received(1).InsertReason("Reason", "ReasonSC");
    }

    [Fact]
    public async Task SendEmail_Successful_ReturnSendEmailResults()
    {
        // Arrange
        var query = new VoidTicketsQuery();
        var tickets = new List<TicketEmailModel> { new() };
        var expected = new List<Result> { new() { ErrorMsg = "Void Bets Successful!" } };
        var emailService = Substitute.For<SendEmailService>();
        emailService.SendEmail(Arg.Any<EmailVoidModel>(), tickets)
            .ReturnsForAnyArgs(expected);
        var service = CreateService(emailService);

        // Act
        var results = await service.SendEmail(query, tickets);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    public VoidServiceImp CreateService(SendEmailService emailService)
    {
        var sessionService = Substitute.For<SessionService>();
        var repository = Substitute.For<Repository>();
        var loggingService = Substitute.For<LoggingService>();
        var messageService = Substitute.For<SendMessageService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidServiceImp(
            mapper,
            sessionService,
            repository,
            loggingService,
            messageService,
            emailService);
    }

    public static VoidServiceImp CreateService(SendMessageService messageService)
    {
        var sessionService = Substitute.For<SessionService>();
        var repository = Substitute.For<Repository>();
        var loggingService = Substitute.For<LoggingService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        return new VoidServiceImp(
            mapper,
            sessionService,
            repository,
            loggingService,
            messageService,
            emailService);
    }

    public static VoidServiceImp CreateService(Repository repository)
    {
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        var messageService = Substitute.For<SendMessageService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidServiceImp(
            mapper,
            sessionService,
            repository,
            loggingService,
            messageService,
            emailService);
    }
}