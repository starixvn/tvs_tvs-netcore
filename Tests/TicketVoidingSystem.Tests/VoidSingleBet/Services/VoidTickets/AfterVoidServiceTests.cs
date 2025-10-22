using AutoMapper;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.SendEmail.Void;
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
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        sendEmailService.SendEmail(null, null).ReturnsForAnyArgs(new List<Result> { new() });
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageByPlatformService,
            sendEmailService, notificationLetstalkService, loggingService);

        // Act
        var actual = await service.ExecuteWhenVoidSuccess(query, voidResult, "");

        // Assert
        var iEnumerable = actual.ToList();
        Assert.True(iEnumerable.First().IsSuccessful);
        Assert.Equal("", iEnumerable.First().ErrorMsg);
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
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageByPlatformService,
            sendEmailService, notificationLetstalkService, loggingService);

        // Act
        var actual = await service.ExecuteWhenVoidSuccess(query, voidResult, "Failed NP");

        // Assert
        var iEnumerable = actual.ToList();
        Assert.False(iEnumerable.First().IsSuccessful);
        Assert.Equal("Failed NP", iEnumerable.First().ErrorMsg);
    }

    [Fact]
    public async Task ExecuteWhenVoidSuccess_Successful_CalledExpected()
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
        var results = new List<Result> { new() };
        var cashOutApiService = Substitute.For<CashOutApiService>();
        var mapper = Substitute.For<IMapper>();
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        sendEmailService.SendEmail(Arg.Any<EmailVoidModel>(), Arg.Any<IEnumerable<TicketEmailModel>>()).ReturnsForAnyArgs(results);
        notificationLetstalkService.SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>()).ReturnsForAnyArgs(results);
        mapper.Map<EmailVoidModel>(Arg.Any<VoidTicketsQuery>()).ReturnsForAnyArgs(new EmailVoidModel());
        mapper.Map<TicketInfoForLetstalk>(Arg.Any<VoidTicketsQuery>()).ReturnsForAnyArgs(new TicketInfoForLetstalk());
        var service = new AfterVoidServiceImp(mapper, cashOutApiService, sendMessageByPlatformService,
            sendEmailService, notificationLetstalkService, loggingService);

        // Act
        var actual = await service.ExecuteWhenVoidSuccess(query, voidResult, "");

        // Assert
        Assert.True(actual.First().IsSuccessful);
        await sendMessageByPlatformService.Received(1).Execute(Arg.Any<SendMessageTargetParam>());
        await sendEmailService.Received(1).SendEmail(Arg.Any<EmailVoidModel>(), Arg.Any<IEnumerable<TicketEmailModel>>());
        await notificationLetstalkService.Received(1).SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(),
            Arg.Any<IEnumerable<TicketEmailModel>>());
    }

    [Fact]
    public async Task ExecuteWhenVoidSuccess_HasException_CalledExpected()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            Message = new Message(),
            MatchId = 1
        };
        var voidResult = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel> { new() },
            Validation = new VoidTicketValidation()
        };
        var cashOutApiService = Substitute.For<CashOutApiService>();
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var service = new AfterVoidServiceImp(null, cashOutApiService, sendMessageByPlatformService,
            sendEmailService, notificationLetstalkService, loggingService);

        // Act
        var actual = await service.ExecuteWhenVoidSuccess(query, voidResult, "");

        // Assert
        await loggingService.Received(1).ErrorAsync(Arg.Any<string>(), Arg.Any<Exception>());
        Assert.Equal(ErrorCode.SendMessageOrEmailFail, actual.First().ErrorCode);
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
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageByPlatformService,
            sendEmailService, notificationLetstalkService, loggingService);

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
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageByPlatformService,
            sendEmailService, notificationLetstalkService, loggingService);

        // Act
        var actual = service.ExecuteWhenVoidFailed(voidResult.Validation);

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
        var sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        var sendEmailService = Substitute.For<SendEmailService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var loggingService = Substitute.For<LoggingService>();
        var service = new AfterVoidServiceImp(TestSetup.CreateMapper(), cashOutApiService, sendMessageByPlatformService,
            sendEmailService, notificationLetstalkService, loggingService);

        // Act
        var actual = service.ExecuteWhenVoidFailed(voidResult.Validation);

        // Assert
        var iEnumerable = actual.ToList();
        Assert.True(iEnumerable.Any());
        Assert.False(iEnumerable.First().IsSuccessful);
        Assert.Equal(1, iEnumerable.First().ErrorCode);
        Assert.Equal("Failed", iEnumerable.First().ErrorMsg);
    }
}