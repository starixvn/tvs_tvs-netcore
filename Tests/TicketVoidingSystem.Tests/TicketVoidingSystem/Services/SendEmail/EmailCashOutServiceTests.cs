using System.Collections.Generic;
using Fanex.MailDeliver.MailClient.Model;
using NSubstitute;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Void;
using TicketVoidingSystem.Services.SendMessage;
using TicketVoidingSystem.Utilities;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class EmailCashOutServiceTests
{
    private readonly EmailSimpleService emailSimpleService;
    private readonly EmailCashOutServiceImp service;
    private readonly SitesEmailService sitesEmailService;
    private readonly VoidEmailContentService voidEmailContentService;
    private readonly SpecialPlatformService specialPlatformService;

    public EmailCashOutServiceTests()
    {
        sitesEmailService = Substitute.For<SitesEmailService>();
        emailSimpleService = Substitute.For<EmailSimpleService>();
        voidEmailContentService = Substitute.For<VoidEmailContentService>();
        specialPlatformService = Substitute.For<SpecialPlatformService>();
        service = new EmailCashOutServiceImp(sitesEmailService, emailSimpleService, voidEmailContentService, specialPlatformService);
    }

    [Fact]
    public void Send_HasCalledSendFormEmailSimpleService()
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel();
        var sites = new List<SiteEmail>();
        var tickets = new List<TicketEmailModel>
            { new() { IsCashOut = true }, new() { IsCashOut = true } };
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.CashOut)
            .ReturnsForAnyArgs(new SiteEmail());
        voidEmailContentService.Create(MessagePackCloner.Clone(mailVoidViewModel), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.CashOut, true)
            .ReturnsForAnyArgs(new MailRecord());
        specialPlatformService.RemoveCheckStatement(Arg.Any<Message>()).ReturnsForAnyArgs(new Message());

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, true);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.CashOut);
    }
}