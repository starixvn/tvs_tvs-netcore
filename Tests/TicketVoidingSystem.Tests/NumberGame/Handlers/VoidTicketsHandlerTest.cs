using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.NumberGame.Handlers;
using SpecialDelete.NumberGame.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Handlers;


public class VoidTicketsHandlerTest
{
    [Fact]
    public async Task VoidTickets_HasError_ReturnResultWithErrorInfo()
    {
        // Arrange
        var validation = new Result
        {
            ErrorCode = ErrorCode.ExecuteQueryFail,
            ErrorMsg = "Failed to void tickets!"
        };
        var voidResult = (Enumerable.Empty<TicketEmailModel>(), validation);
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var message = new VoidTicketsRequest { Tickets = tickets, MatchId = 123 };
        var voidService = Substitute.For<VoidService>();
        var loggingService = Substitute.For<LoggingService>();
        voidService.VoidTickets(null).ReturnsForAnyArgs(voidResult);
        var handler = new VoidTicketsHandler(voidService, loggingService);

        // Act
        var results = await handler.Handle(message, CancellationToken.None);

        // Assert
        AssertExtension.Equal(validation, results.ElementAt(0));
    }

    [Fact]
    public async Task VoidTickets_SuccessfullySendEmail_ReturnSendEmailResult()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var message = new VoidTicketsRequest { Tickets = tickets, MatchId = 123 };
        var emailTickets = new List<TicketEmailModel>();
        var expected = new List<Result> { new() { ErrorMsg = "Successfully void tickets!" } };
        var voidService = Substitute.For<VoidService>();
        var loggingService = Substitute.For<LoggingService>();
        voidService.VoidTickets(message).ReturnsForAnyArgs((emailTickets, new Result()));
        voidService.SendEmail(message, emailTickets).ReturnsForAnyArgs(expected);
        var handler = new VoidTicketsHandler(voidService, loggingService);

        // Act
        var results = await handler.Handle(message, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    [Fact]
    public async Task VoidTickets_IsSendMessage_CallSendMessage()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var message = new VoidTicketsRequest { Tickets = tickets, IsSendMessage = true };
        var emailTickets = new List<TicketEmailModel>();
        var expected = new List<Result> { new() { ErrorMsg = "Successfully void tickets!" } };
        var voidService = Substitute.For<VoidService>();
        var loggingService = Substitute.For<LoggingService>();
        voidService.VoidTickets(message).ReturnsForAnyArgs((emailTickets, new Result()));
        voidService.SendEmail(message, emailTickets).ReturnsForAnyArgs(expected);
        var handler = new VoidTicketsHandler(voidService, loggingService);

        // Act
        await handler.Handle(message, CancellationToken.None);

        // Assert
        await voidService.Received().SendMessage(message, emailTickets);
    }

    [Fact]
    public async Task VoidTickets_ExceptionSendEmail_ReturnExceptionResult()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var message = new VoidTicketsRequest { Tickets = tickets, MatchId = 123 };
        var emailTickets = new List<TicketEmailModel>();
        var exception = new Exception("Failed to Send Email!");
        var voidService = Substitute.For<VoidService>();
        var loggingService = Substitute.For<LoggingService>();
        voidService.VoidTickets(message).ReturnsForAnyArgs((emailTickets, new Result()));
        voidService.When(x => x.SendEmail(message, emailTickets))
            .Do(x => throw exception);
        var handler = new VoidTicketsHandler(voidService, loggingService);

        // Act
        var results = await handler.Handle(message, CancellationToken.None);

        // Assert
        await loggingService.Received().ErrorAsync("123", exception);
        var expected = new List<Result>
        {
            new() { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = "Failed to Send Email!" }
        };
        AssertExtension.Equal(expected, results);
    }
}