using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Repositories;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.Void;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Services.VoidTickets;

public class VoidTicketsServiceTest
{
    [Fact]
    public async Task ExecuteQuery_HasCriteria_ReturnVoidTicketsFromRepository()
    {
        // Arrange
        var expected = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel>()
        };
        var query = new VoidTicketsQuery { Password = "Test" };
        var repository = Substitute.For<Repository>();
        repository
            .VoidTickets(new VoidTicketsQuery())
            .ReturnsForAnyArgs(expected);
        var service = CreateService(repository);

        // Act
        var actual = await service.ExecuteQuery(query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task ExecuteQuery_RepositoryThrowException_UpdateOutputParam()
    {
        // Arrange
        var exception = new Exception("Error Void Tickets");
        var validation = new VoidTicketsValidation
        {
            ErrorCode = ErrorCode.ExecuteQueryFail,
            ErrorMsg = exception.Message
        };
        var expected = new VoidTicketsModel
        {
            Tickets = Enumerable.Empty<TicketEmailModel>(),
            Validation = validation
        };
        var query = new VoidTicketsQuery { Password = "Test" };
        var repository = Substitute.For<Repository>();
        repository
            .When(x => x.VoidTickets(Arg.Any<VoidTicketsQuery>()))
            .Do(_ => throw exception);
        var service = CreateService(repository);

        // Act
        var actual = await service.ExecuteQuery(query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task ExecuteQuery_RepositoryThrowException_WriteLog()
    {
        // Arrange
        var exception = new Exception("Error Void Tickets");
        var query = new VoidTicketsQuery { MatchId = 123, Password = "Test" };
        var repository = Substitute.For<Repository>();
        var loggingService = Substitute.For<LoggingService>();
        repository
            .When(x => x.VoidTickets(Arg.Any<VoidTicketsQuery>()))
            .Do(_ => throw exception);
        var service = CreateService(repository, loggingService);

        // Act
        await service.ExecuteQuery(query);

        // Assert
        await loggingService
            .Received()
            .ErrorAsync(query.MatchId.ToString(), exception);
    }

    [Fact]
    public async Task SendMessage_Successfully_CallExpectedApi()
    {
        // Arrange
        var tickets = new List<TicketEmailModel>();
        var query = new VoidTicketsQuery
        {
            MatchId = 123,
            Message = new Message { ContentEnglish = "Content english", CreatorId = 333 },
            Reason = "Soccer - Early Kick Off",
            ReasonSC = "足球 - 由于赛事时间提前开始"
        };

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
        var model = new VoidTicketsModel
        {
            Validation = new VoidTicketsValidation(),
            Tickets = new List<TicketEmailModel>()
        };
        var expected = new List<Result> { new() { ErrorMsg = "Void Bets Successful!" } };
        var emailService = Substitute.For<SendEmailService>();
        emailService.SendEmail(Arg.Any<EmailVoidModel>(), model.Tickets.ToList())
            .ReturnsForAnyArgs(expected);
        var service = CreateService(emailService);

        // Act
        var results = await service.SendEmail(query, model);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    private static VoidTicketsServiceImp CreateService(SendEmailService emailService)
    {
        var repository = Substitute.For<Repository>();
        var loggingService = Substitute.For<LoggingService>();
        var messageService = Substitute.For<SendMessageByPlatformService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            repository,
            loggingService,
            messageService,
            emailService);
    }

    private static VoidTicketsServiceImp CreateService(Repository repository)
    {
        var loggingService = Substitute.For<LoggingService>();
        var messageService = Substitute.For<SendMessageByPlatformService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            repository,
            loggingService,
            messageService,
            emailService);
    }

    private static VoidTicketsServiceImp CreateService(Repository repository, LoggingService loggingService)
    {
        var messageService = Substitute.For<SendMessageByPlatformService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            repository,
            loggingService,
            messageService,
            emailService);
    }

    private static VoidTicketsServiceImp CreateService(SendMessageByPlatformService messageService)
    {
        var repository = Substitute.For<Repository>();
        var loggingService = Substitute.For<LoggingService>();

        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            repository,
            loggingService,
            messageService,
            emailService);
    }
}