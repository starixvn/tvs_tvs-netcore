using System;
using System.Collections.Generic;
using Fanex.MailDeliver.Model;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Void;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class EmailSimpleServiceTests
{
    private readonly FanexMailApiService fanexMailApiService;
    private readonly VoidEmailContentService voidEmailContentService;
    private EmailSimpleServiceImp service;

    public EmailSimpleServiceTests()
    {
        voidEmailContentService = Substitute.For<VoidEmailContentService>();
        fanexMailApiService = Substitute.For<FanexMailApiService>();
        service = new EmailSimpleServiceImp(voidEmailContentService, fanexMailApiService);
    }

    [Fact]
    public void Send_HasServiceIsValid_HasCalledSendEmail()
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel();
        var site = new SiteEmail();
        var tickets = new List<TicketEmailModel>
            { new() { Currency = CurrencyConstant.UusId }, new() { Currency = CurrencyConstant.UusId } };
        voidEmailContentService.Create(Arg.Any<MailVoidViewModel>(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<TicketEmailModel>>(), Arg.Any<EmailGroup>(), true)
            .ReturnsForAnyArgs(new MailRecord());

        // Act
        _ = service.Send(mailVoidViewModel, site, tickets, new EmailGroup(), true);

        // Assert
        fanexMailApiService.Received(1).SendEmail(Arg.Any<MailRecord>());
    }

    [Fact]
    public void Send_HasServiceIsNotValid_HasWriteLog()
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel();
        var site = new SiteEmail();
        var tickets = new List<TicketEmailModel>
            { new() { Currency = CurrencyConstant.UusId }, new() { Currency = CurrencyConstant.UusId } };
        service = new EmailSimpleServiceImp(null, fanexMailApiService);

        // Act
        _ = service.Send(mailVoidViewModel, site, tickets, new EmailGroup(), true);

        // Assert
        fanexMailApiService.Received(1).WriteLog(Arg.Any<EmailGroup>(), Arg.Any<Exception>());
    }
}