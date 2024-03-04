using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using SpecialDelete.NumberGame.Services.VoidTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.Void;
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
    public static async Task VoidTickets_ThrowException_CalledExpected()
    {
        // Arrange
        var query = new VoidTicketsQuery { UserPwd = "pass" };
        var loggingService = Substitute.For<LoggingService>();
        var service = new VoidServiceImp(null, null, loggingService, null, null);

        // Act
        await service.VoidTickets(query);

        // Assert
        await loggingService.Received(1).ErrorAsync(query.MatchId.ToString(), Arg.Any<Exception>());
    }

    [Fact]
    public static async Task SendMessage_Successful_CallExpectedSendMessageByPlatformService()
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
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var service = CreateService(sendMessageByPlatformService);

        // Act
        await service.SendMessage(query, tickets);

        // Assert
        await sendMessageByPlatformService.Execute(Arg.Any<SendMessageTargetParam>());
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
        var repository = Substitute.For<Repository>();
        var loggingService = Substitute.For<LoggingService>();
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidServiceImp(
            mapper,
            repository,
            loggingService,
            sendMessageByPlatformService,
            emailService);
    }

    public static VoidServiceImp CreateService(SendMessageByPlatformService sendEmailService)
    {
        var repository = Substitute.For<Repository>();
        var loggingService = Substitute.For<LoggingService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        return new VoidServiceImp(
            mapper,
            repository,
            loggingService,
            sendEmailService,
            emailService);
    }

    public static VoidServiceImp CreateService(Repository repository)
    {
        var loggingService = Substitute.For<LoggingService>();
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidServiceImp(
            mapper,
            repository,
            loggingService,
            sendMessageByPlatformService,
            emailService);
    }
}