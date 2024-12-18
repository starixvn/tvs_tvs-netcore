using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Recover;
using TicketVoidingSystem.SharedApi.Handlers.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SendEmail;

public class SendEmailRecoverApiHandlerTests
{
    [Fact]
    public async Task Handle_ValidRequest_CallsSendEmailService()
    {
        // Arrange
        var sendEmailRecoverService = Substitute.For<SendEmailRecoverService>();
        var handler = new SendEmailRecoverApiHandler(sendEmailRecoverService);
        var request = new SendEmailRecoverApiRequest
        {
            ActorUsername = "testUser",
            NegativeBalanceUsers = "user1,user2",
            Tickets = new List<TicketRecoverEmailModel>
            {
                new() { BetId = 1 },
                new() { BetId = 2 }
            }
        };

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await sendEmailRecoverService.Received(1).SendEmail(Arg.Any<MailRecoverViewModel>(), request.Tickets);
    }
}