using System;
using Fanex.MailDeliver.MailClient.Model;
using NSubstitute;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class EmailSimpleServiceTests
{
    private readonly FanexMailApiService fanexMailApiService;
    private readonly EmailSimpleServiceImp service;

    public EmailSimpleServiceTests()
    {
        fanexMailApiService = Substitute.For<FanexMailApiService>();
        service = new EmailSimpleServiceImp(fanexMailApiService);
    }

    [Fact]
    public void Send_HasServiceIsValid_HasCalledSendEmail()
    {
        // Act
        _ = service.Send(new MailRecord(), new EmailGroup());

        // Assert
        fanexMailApiService.Received(1).SendEmail(Arg.Any<MailRecord>(), Arg.Any<SiteEmail>());
    }

    [Fact]
    public void Send_HasException_HasCalledWriteLog()
    {
        // Act
        fanexMailApiService.When(x => x.SendEmail(Arg.Any<MailRecord>(), null)).Throw(_ => new Exception());
        _ = service.Send(new MailRecord(), new EmailGroup());

        // Assert
        fanexMailApiService.Received(1).WriteLog(Arg.Any<EmailGroup>(), Arg.Any<Exception>());
    }
}