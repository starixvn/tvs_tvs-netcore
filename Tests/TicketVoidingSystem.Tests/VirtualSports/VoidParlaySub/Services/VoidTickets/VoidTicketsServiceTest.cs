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
using TicketVoidingSystem.Services.SendEmail;
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
            .Do(y => throw exception);
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
            .Do(y => throw exception);
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
        const int messageId = 111;
        const int reasonId = 123;
        var messageService = Substitute.For<SendMessageService>();
        messageService.InsertMessage(query.Message, 1, null, false).ReturnsForAnyArgs(messageId);
        messageService.InsertReason(query.Reason, query.ReasonSC).ReturnsForAnyArgs(reasonId);
        var service = CreateService(messageService);

        // Act
        await service.SendMessage(query, tickets);

        // Assert
        await messageService.Received(1)
            .InsertVoidedTransaction(Arg.Any<IEnumerable<TicketEmailModel>>(), Arg.Is(111), Arg.Is(123), Arg.Is(0), Arg.Is(0));
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
        var expected = new List<Result> { new Result { ErrorMsg = "Void Bets Successful!" } };
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
        var sessionService = Substitute.For<SessionService>();
        var repository = Substitute.For<Repository>();
        var loggingService = Substitute.For<LoggingService>();
        var messageService = Substitute.For<SendMessageService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            sessionService,
            repository,
            loggingService,
            messageService,
            emailService);
    }

    private static VoidTicketsServiceImp CreateService(Repository repository)
    {
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        var messageService = Substitute.For<SendMessageService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            sessionService,
            repository,
            loggingService,
            messageService,
            emailService);
    }

    private static VoidTicketsServiceImp CreateService(Repository repository, LoggingService loggingService)
    {
        var sessionService = Substitute.For<SessionService>();
        var messageService = Substitute.For<SendMessageService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            sessionService,
            repository,
            loggingService,
            messageService,
            emailService);
    }

    private static VoidTicketsServiceImp CreateService(SendMessageService messageService)
    {
        var sessionService = Substitute.For<SessionService>();
        var repository = Substitute.For<Repository>();
        var loggingService = Substitute.For<LoggingService>();

        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            sessionService,
            repository,
            loggingService,
            messageService,
            emailService);
    }
}