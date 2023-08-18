using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.SharedApi.Handlers.SendEmail;
using TicketVoidingSystem.SharedApi.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SendEmail;

public class SendEmailApiHandlerTests
{
    [Fact]
    public async Task Handle_CallExpected()
    {
        // Arrange
        var message = new SendEmailApiRequest
            { EmailTickets = new List<TicketEmailModel> { new() }, VoidedReason = new VoidedReason() };
        var sendEmailService = Substitute.For<SendEmailService>();
        sendEmailService.SendEmail(Arg.Any<EmailVoidModel>(), Arg.Any<IEnumerable<TicketEmailModel>>(), true)
            .ReturnsForAnyArgs(new List<Result>());
        var handler = new SendEmailApiHandler(sendEmailService);

        // Act
        await handler.Handle(message, CancellationToken.None);

        // Assert
        await sendEmailService.Received(1)
            .SendEmail(Arg.Any<EmailVoidModel>(), Arg.Any<IEnumerable<TicketEmailModel>>(), true);
    }
}