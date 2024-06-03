using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Repositories;
using SpecialDelete.VoidByCurrency.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.Void;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services.VoidTickets;

public class VoidTicketsServiceTest
{
    [Fact]
    public async Task ExecuteQuery_HasCriteria_ReturnVoidTicketsFromRepository()
    {
        // Arrange
        var tickets = new List<TicketEmailModel>
        {
            new() { TransId = 123 },
            new() { TransId = 456 }
        };
        var expected = new VoidTicketsModel { Tickets = tickets };
        var query = new VoidTicketsQuery
        {
            UserPassword = "Test",
            Match = new Match(),
            NegativeBalanceUsers = string.Empty
        };
        var repository = Substitute.For<VoidByCurrencyRepository>();
        repository.VoidTickets(Arg.Any<VoidTicketsQuery>()).ReturnsForAnyArgs(expected);
        var service = CreateService(repository);

        // Act
        var actual = await service.ExecuteQuery(query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task ExecuteQuery_RepositoryThrowException_UpdateOutput()
    {
        // Arrange
        var exception = new Exception("Error Void Tickets");
        var validation = new VoidTicketsValidation
        {
            ErrorCode = ErrorCode.ExecuteQueryFail,
            ErrorMsg = exception.Message
        };
        var expected = new VoidTicketsModel { Validation = validation };
        var query = new VoidTicketsQuery { UserPassword = "Test" };
        var repository = Substitute.For<VoidByCurrencyRepository>();
        repository
            .When(x => x.VoidTickets(Arg.Any<VoidTicketsQuery>()))
            .Do(_ => throw exception);
        var service = CreateService(repository);

        // Act
        var model = await service.ExecuteQuery(query);

        // Assert
        Assert.Equal(expected.Validation.ErrorCode, model.Validation.ErrorCode);
        Assert.Equal(expected.Validation.ErrorMsg, model.Validation.ErrorMsg);
    }

    [Fact]
    public async Task ExecuteQuery_RepositoryThrowException_WriteLog()
    {
        // Arrange
        var exception = new Exception("Error Void Tickets");
        var query = new VoidTicketsQuery { UserPassword = "Test", MatchId = 123 };
        var repository = Substitute.For<VoidByCurrencyRepository>();
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
            .ErrorAsync("123", exception);
    }

    [Fact]
    public async Task SendMessage_Successfully_CallExpectedApi()
    {
        // Arrange
        var query = new VoidTicketsQuery
        { UserName = "TEST", Message = new Message { ContentEnglish = "Content english" } };
        var tickets = new List<TicketEmailModel>
        {
            new() { IsMixParlay = false, TransId = 1, CustId = 1, MatchId = 1 },
            new() { IsMixParlay = true, TransId = 1, CustId = 1, MatchId = 1 }
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
        var tickets = new List<TicketEmailModel> { new() };
        var expected = new List<Result> { new() { ErrorMsg = "Void Bets Successful!" } };
        var emailService = Substitute.For<SendEmailService>();
        emailService.SendEmail(Arg.Any<EmailVoidModel>(), tickets)
            .ReturnsForAnyArgs(expected);
        var service = CreateService(emailService);

        // Act
        var voidTickets = new VoidTicketsModel
        {
            Validation = new VoidTicketsValidation(),
            Tickets = tickets
        };
        var results = await service.SendEmail(query, voidTickets);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    private static VoidTicketsServiceImp CreateService(
        SendEmailService emailService)
    {
        var repository = Substitute.For<VoidByCurrencyRepository>();
        var loggingService = Substitute.For<LoggingService>();
        var messageService = Substitute.For<SendMessageByPlatformService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            repository,
            messageService,
            loggingService,
            emailService);
    }

    private static VoidTicketsServiceImp CreateService(SendMessageByPlatformService messageService)
    {
        var repository = Substitute.For<VoidByCurrencyRepository>();
        var loggingService = Substitute.For<LoggingService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            repository,
            messageService,
            loggingService,
            emailService);
    }

    private static VoidTicketsServiceImp CreateService(VoidByCurrencyRepository repository,
        LoggingService loggingService)
    {
        var messageService = Substitute.For<SendMessageByPlatformService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            repository,
            messageService,
            loggingService,
            emailService);
    }

    private static VoidTicketsServiceImp CreateService(VoidByCurrencyRepository repository)
    {
        var messageService = Substitute.For<SendMessageByPlatformService>();
        var loggingService = Substitute.For<LoggingService>();
        var emailService = Substitute.For<SendEmailService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());
        return new VoidTicketsServiceImp(
            mapper,
            repository,
            messageService,
            loggingService,
            emailService);
    }
}