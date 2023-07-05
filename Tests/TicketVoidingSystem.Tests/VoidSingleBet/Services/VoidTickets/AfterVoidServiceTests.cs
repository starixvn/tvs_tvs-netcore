using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.VoidTickets;

public class AfterVoidServiceTests
{
    [Fact]
    public async Task ExecuteWhenVoidSuccess_HasNotWarningCricket_ReturnExpected()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            Message = new Message(),
            Match = new Match()
        };
        var voidResult = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel> { new() },
            Validation = new VoidTicketValidation()
        };
        var cashOutApiService = Substitute.For<CashOutApiService>();
        var sendMessageService = Substitute.For<SendMessageService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var sessionService = Substitute.For<SessionService>();
        sendEmailService.SendEmail(default, default).ReturnsForAnyArgs(new List<Result> { new() });
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageService,
            sendEmailService, notificationLetstalkService, loggingService, sessionService);

        // Act
        var actual = await service.ExecuteWhenVoidSuccess(query, voidResult, "");

        // Assert
        Assert.True(actual.First().IsSuccessful);
        Assert.Equal("", actual.First().ErrorMsg);
    }

    [Fact]
    public async Task ExecuteWhenVoidSuccess_HasWarningCricket_ReturnExpected()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            Message = new Message(),
            Match = new Match()
        };
        var voidResult = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel> { new() },
            Validation = new VoidTicketValidation()
        };
        var cashOutApiService = Substitute.For<CashOutApiService>();
        var sendMessageService = Substitute.For<SendMessageService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var sessionService = Substitute.For<SessionService>();
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageService,
            sendEmailService, notificationLetstalkService, loggingService, sessionService);

        // Act
        var actual = await service.ExecuteWhenVoidSuccess(query, voidResult, "Failed NP");

        // Assert
        Assert.False(actual.First().IsSuccessful);
        Assert.Equal("Failed NP", actual.First().ErrorMsg);
    }

    [Fact]
    public async Task ExecuteWhenVoidSuccess_HasExceptionWhenSendMessage_ReturnExpected()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            Message = new Message(),
            Match = null
        };
        var voidResult = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel> { new() },
            Validation = new VoidTicketValidation()
        };
        var cashOutApiService = Substitute.For<CashOutApiService>();
        var sendMessageService = Substitute.For<SendMessageService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var sessionService = Substitute.For<SessionService>();
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageService,
            sendEmailService, notificationLetstalkService, loggingService, sessionService);

        // Act
        var actual = await service.ExecuteWhenVoidSuccess(query, voidResult, "");

        // Assert
        Assert.False(actual.First().IsSuccessful);
    }

    [Fact]
    public async Task ExecuteWhenVoidSuccess_HaveNotTicket_ReturnEmptyResult()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            Message = new Message(),
            Match = null
        };
        var voidResult = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel>(),
            Validation = new VoidTicketValidation()
        };
        var cashOutApiService = Substitute.For<CashOutApiService>();
        var sendMessageService = Substitute.For<SendMessageService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var sessionService = Substitute.For<SessionService>();
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageService,
            sendEmailService, notificationLetstalkService, loggingService, sessionService);

        // Act
        var actual = await service.ExecuteWhenVoidSuccess(query, voidResult, "");

        // Assert
        Assert.False(actual.Any());
    }

    [Fact]
    public void ExecuteWhenVoidFailed_HaveNotTicket_ReturnEmptyResult()
    {
        // Arrange
        var voidResult = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel>(),
            Validation = new VoidTicketValidation()
        };
        var cashOutApiService = Substitute.For<CashOutApiService>();
        var sendMessageService = Substitute.For<SendMessageService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var sessionService = Substitute.For<SessionService>();
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageService,
            sendEmailService, notificationLetstalkService, loggingService, sessionService);

        // Act
        var actual = service.ExecuteWhenVoidFailed(voidResult);

        // Assert
        Assert.False(actual.Any());
    }

    [Fact]
    public void ExecuteWhenVoidFailed_HaveFailedTickets_ReturnResult()
    {
        // Arrange
        var voidResult = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel> { new() },
            Validation = new VoidTicketValidation { ErrorCode = 1, ErrorMsg = "Failed" }
        };
        var cashOutApiService = Substitute.For<CashOutApiService>();
        var sendMessageService = Substitute.For<SendMessageService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var sessionService = Substitute.For<SessionService>();
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageService,
            sendEmailService, notificationLetstalkService, loggingService, sessionService);

        // Act
        var actual = service.ExecuteWhenVoidFailed(voidResult);

        // Assert
        Assert.True(actual.Any());
        Assert.False(actual.First().IsSuccessful);
        Assert.Equal(1, actual.First().ErrorCode);
        Assert.Equal("Failed", actual.First().ErrorMsg);
    }
}