using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets;


public class RecoverTicketsServiceTest
{
    private static RecoverTicketsServiceImp CreateService(Repository repository)
    {
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        var messageService = Substitute.For<SendMessageService>();
        var sitesEmailService = Substitute.For<SitesEmailService>();
        var emailService = Substitute.For<EmailService>();
        return new RecoverTicketsServiceImp(
            repository,
            sessionService,
            loggingService,
            messageService,
            sitesEmailService,
            emailService);
    }

    [Fact]
    public async Task ExecuteQuery_Successful_ReturnModel()
    {
        // Arrange
        var expected = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel>()
        };
        var query = new Query();
        var repository = Substitute.For<Repository>();
        repository.RecoverTickets(Arg.Any<Query>()).ReturnsForAnyArgs(expected);
        var service = CreateService(repository);

        // Act
        var model = await service.ExecuteQuery(query);

        // Assert
        AssertExtension.Equal(expected, model);
    }

    [Fact]
    public async Task ExecuteQuery_ThrowException_UpdateModel()
    {
        // Arrange
        var validation = new RecoverTicketsValidation
        {
            ErrorCode = ErrorCode.ExecuteQueryFail,
            ErrorMsg = "Execute SP fail"
        };
        var exception = new Exception("Execute SP fail");
        var expected = new RecoverTicketsModel
        {
            Validation = validation
        };
        var query = new Query();
        var repository = Substitute.For<Repository>();
        repository
            .When(x => x.RecoverTickets(Arg.Any<Query>()))
            .Do(x => throw exception);
        var service = CreateService(repository);

        // Act
        var model = await service.ExecuteQuery(query);

        // Assert
        AssertExtension.Equal(expected.Validation, model.Validation);
    }

    private static RecoverTicketsServiceImp CreateService(
        Repository repository,
        LoggingService loggingService)
    {
        var sessionService = Substitute.For<SessionService>();
        var messageService = Substitute.For<SendMessageService>();
        var sitesEmailService = Substitute.For<SitesEmailService>();
        var emailService = Substitute.For<EmailService>();
        return new RecoverTicketsServiceImp(
            repository,
            sessionService,
            loggingService,
            messageService,
            sitesEmailService,
            emailService);
    }

    [Fact]
    public async Task ExecuteQuery_ThrowException_WriteLog()
    {
        // Arrange
        var exception = new Exception("Execute SP fail");
        var query = new Query();
        var repository = Substitute.For<Repository>();
        repository
            .When(x => x.RecoverTickets(Arg.Any<Query>()))
            .Do(x => throw exception);
        var loggingService = Substitute.For<LoggingService>();
        var service = CreateService(repository, loggingService);

        // Act
        await service.ExecuteQuery(query);

        // Assert
        await loggingService.Received().ErrorAsync(exception);
    }

    private static RecoverTicketsServiceImp CreateService(SendMessageService messageService)
    {
        var repository = Substitute.For<Repository>();
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        var sitesEmailService = Substitute.For<SitesEmailService>();
        var emailService = Substitute.For<EmailService>();
        return new RecoverTicketsServiceImp(
            repository,
            sessionService,
            loggingService,
            messageService,
            sitesEmailService,
            emailService);
    }

    [Fact]
    public async Task RemoveMessage_CallMessageService()
    {
        // Arrange
        var messageService = Substitute.For<SendMessageService>();
        var service = CreateService(messageService);
        var model = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel> { new() { TransId = 1, MatchId = 1 } }
        };
        // Act
        await service.RemoveMessage(model);

        // Assert
        await messageService.Received().RemoveMessage(0, "1");
    }

    private static RecoverTicketsServiceImp CreateService(EmailService emailService)
    {
        var repository = Substitute.For<Repository>();
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        var messageService = Substitute.For<SendMessageService>();
        var sitesEmailService = Substitute.For<SitesEmailService>();

        return new RecoverTicketsServiceImp(
            repository,
            sessionService,
            loggingService,
            messageService,
            sitesEmailService,
            emailService);
    }

    private static RecoverTicketsModel FakeModel()
    {
        return new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel>
            {
                new() { IsItSupport = true, TransId = 1, CurrencyCode = "UUS" },
                new() { IsItSupport = false, TransId = 2, CurrencyCode = "UUS" },
                new() { IsItSupport = true, TransId = 3, CurrencyCode = "CNY" },
                new() { IsItSupport = false, TransId = 4, CurrencyCode = "CNY" }
            }
        };
    }

    [Fact]
    public async Task SendEmail_RealTicketOrTicketVoidedByCsd_SendEmailToCsdRecover()
    {
        // Arrange
        var model = FakeModel();
        model.Validation = new RecoverTicketsValidation();
        var emailService = Substitute.For<EmailService>();
        var service = CreateService(emailService);

        // Act
        await service.SendEmail(model, Recover.None);

        // Assert
        emailService.Received().SendEmail(
            Arg.Any<MailRecoverModel<MailTicketViewModel, RecoverTicketModel>>(), EmailGroup.Recover,
            Recover.None);
    }

    [Fact]
    public async Task SendEmail_UusTicketsAndVoidByIt_SendEmailToItQa()
    {
        // Arrange
        var model = FakeModel();
        var expected = new List<RecoverTicketModel>
        {
            model.Tickets.First()
        };
        model.Validation = new RecoverTicketsValidation();
        var emailService = Substitute.For<EmailService>();
        var service = CreateService(emailService);

        // Act
        await service.SendEmail(model, Recover.None);

        // Assert
        emailService.Received().SendEmail(
            Arg.Is<MailRecoverModel<MailTicketViewModel, RecoverTicketModel>>
                (x => expected.SequenceEqual(x.Tickets)), EmailGroup.ItQa, Recover.None);
    }

    [Fact]
    public async Task SendEmail_RealTicketsAndVoidByIt_SendEmailToItSupport()
    {
        // Arrange
        var model = FakeModel();
        model.Validation = new RecoverTicketsValidation();
        var emailService = Substitute.For<EmailService>();
        var service = CreateService(emailService);

        // Act
        await service.SendEmail(model, Recover.None);

        // Assert
        emailService.Received().SendEmail(
            Arg.Any<MailRecoverModel<MailTicketViewModel, RecoverTicketModel>>(), EmailGroup.ItSupport,
            Recover.None);
    }
}