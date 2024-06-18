using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.VoidParlaySub.Handlers;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Handlers;

public class VoidTicketsHandlerTest
{
    [Fact]
    public async Task VoidTickets_ErrorCodeIsNotEqualToZero_ReturnErrorResults()
    {
        // Arrange
        var validation = new VoidTicketsValidation
        {
            ErrorCode = 1,
            ErrorMsg = "Something Wrong"
        };
        var message = new VoidTicketsRequest();
        var model = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel> { new() },
            Validation = validation
        };
        var expected = new List<Result> { new() { ErrorCode = validation.ErrorCode, ErrorMsg = validation.ErrorMsg } };
        var voidTicketsService = Substitute.For<VoidTicketsService>();
        voidTicketsService.ExecuteQuery(message).ReturnsForAnyArgs(model);
        var loggingService = Substitute.For<LoggingService>();
        var handler = new VoidTicketsHandler(voidTicketsService, loggingService);

        // Act
        var results = await handler.Handle(message, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    [Fact]
    public async Task VoidTickets_VoidSuccessfully_SendMessage()
    {
        // Arrange
        var message = new VoidTicketsRequest();
        var model = new VoidTicketsModel
        {
            Validation = new VoidTicketsValidation(),
            Tickets = new List<TicketEmailModel> { new() }
        };
        var voidTicketsService = Substitute.For<VoidTicketsService>();
        voidTicketsService.ExecuteQuery(message).ReturnsForAnyArgs(model);
        var loggingService = Substitute.For<LoggingService>();
        var handler = new VoidTicketsHandler(voidTicketsService, loggingService);

        // Act
        await handler.Handle(message, CancellationToken.None);

        // Assert
        await voidTicketsService.Received().SendMessage(message, model.Tickets);
    }

    [Fact]
    public async Task VoidTickets_VoidSuccessfully_ResultCountEmpty()
    {
        // Arrange
        var message = new VoidTicketsRequest();
        var model = new VoidTicketsModel
        {
            Validation = new VoidTicketsValidation(),
            Tickets = new List<TicketEmailModel>()
        };
        var voidTicketsService = Substitute.For<VoidTicketsService>();
        voidTicketsService.ExecuteQuery(message).ReturnsForAnyArgs(model);
        var loggingService = Substitute.For<LoggingService>();
        var handler = new VoidTicketsHandler(voidTicketsService, loggingService);

        // Act
        var actual = await handler.Handle(message, CancellationToken.None);

        // Assert
        Assert.True(!actual.Any());
    }

    [Fact]
    public async Task VoidTickets_HasNegativeBalance_InsertBalanceMessage()
    {
        // Arrange
        var message = new VoidTicketsRequest();
        var model = new VoidTicketsModel
        {
            Validation = new VoidTicketsValidation(),
            Tickets = new List<TicketEmailModel> { new() }
        };

        var voidTicketsService = Substitute.For<VoidTicketsService>();
        voidTicketsService.ExecuteQuery(message).ReturnsForAnyArgs(model);
        voidTicketsService.SendEmail(message, model).ReturnsForAnyArgs(new List<Result> { new() });
        var loggingService = Substitute.For<LoggingService>();
        var handler = new VoidTicketsHandler(voidTicketsService, loggingService);

        // Act
        await handler.Handle(message, CancellationToken.None);

        // Assert
        await voidTicketsService.Received().SendMessage(message, model.Tickets);
    }

    [Fact]
    public async Task VoidTickets_SendEmailThrowException_ReturnExceptionMessage()
    {
        // Arrange
        var message = new VoidTicketsRequest();
        var model = new VoidTicketsModel
        {
            Validation = new VoidTicketsValidation(),
            Tickets = new List<TicketEmailModel> { new() }
        };
        var exception = new Exception("Send Email Failed");
        var expected = new List<Result>
        {
            new()
            {
                ErrorCode = ErrorCode.SendMessageOrEmailFail,
                ErrorMsg = exception.Message
            }
        };
        var voidTicketsService = Substitute.For<VoidTicketsService>();
        voidTicketsService.ExecuteQuery(message).ReturnsForAnyArgs(model);
        voidTicketsService
            .When(x => x.SendEmail(message, model))
            .Do(_ => throw exception);
        var loggingService = Substitute.For<LoggingService>();
        var handler = new VoidTicketsHandler(voidTicketsService, loggingService);

        // Act
        var results = await handler.Handle(message, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    [Fact]
    public async Task VoidTickets_SendEmailThrowException_WriteLog()
    {
        // Arrange
        var message = new VoidTicketsRequest();
        var model = new VoidTicketsModel
        {
            Validation = new VoidTicketsValidation(),
            Tickets = new List<TicketEmailModel> { new() }
        };
        var exception = new Exception("Send Email Failed");
        var voidTicketsService = Substitute.For<VoidTicketsService>();
        var loggingService = Substitute.For<LoggingService>();
        voidTicketsService.ExecuteQuery(message).ReturnsForAnyArgs(model);
        voidTicketsService
            .When(x => x.SendEmail(message, model))
            .Do(_ => throw exception);
        var handler = new VoidTicketsHandler(voidTicketsService, loggingService);

        // Act
        await handler.Handle(message, CancellationToken.None);

        // Assert
        await loggingService.Received().ErrorAsync(exception);
    }
}