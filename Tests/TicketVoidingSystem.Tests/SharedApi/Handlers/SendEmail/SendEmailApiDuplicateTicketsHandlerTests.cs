using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;
using TicketVoidingSystem.SharedApi.Handlers.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SendEmail;

public class SendEmailApiDuplicateTicketsHandlerTests
{
    [Fact]
    public async Task Handle_CallExpected()
    {
        // Arrange
        var message = new SendEmailApiDuplicateTicketsRequest();
        var sendEmailService = Substitute.For<SendEmailDuplicateTicketsService>();
        sendEmailService.SendEmail(Arg.Any<EmailVoidModel>())
            .ReturnsForAnyArgs(new List<Result>());
        var handler = new SendEmailApiDuplicateTicketsHandler(sendEmailService);

        // Act
        await handler.Handle(message, CancellationToken.None);

        // Assert
        await sendEmailService.Received(1).SendEmail(Arg.Any<EmailVoidModel>());
    }
}