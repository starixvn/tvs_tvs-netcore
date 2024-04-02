using System.Collections.Generic;
using Fanex.MailDeliver.MailClient.Model;
using Force.DeepCloner;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Void;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class EmailItQaServiceTests
{
    private readonly EmailSimpleService emailSimpleService;
    private readonly EmailItQaServiceImp service;
    private readonly SitesEmailService sitesEmailService;
    private readonly VoidEmailContentService voidEmailContentService;

    public EmailItQaServiceTests()
    {
        sitesEmailService = Substitute.For<SitesEmailService>();
        emailSimpleService = Substitute.For<EmailSimpleService>();
        voidEmailContentService = Substitute.For<VoidEmailContentService>();
        service = new EmailItQaServiceImp(sitesEmailService, emailSimpleService, voidEmailContentService);
    }

    [Fact]
    public void Send_HasCalledSendFormEmailSimpleService()
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel();
        var sites = new List<SiteEmail>();
        var tickets = new List<TicketEmailModel>
            { new() { Currency = CurrencyConstant.UusId }, new() { Currency = CurrencyConstant.UusId } };
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItQa)
            .ReturnsForAnyArgs(new SiteEmail());
        voidEmailContentService.Create(mailVoidViewModel.DeepClone(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.ItQa, true)
            .ReturnsForAnyArgs(new MailRecord());

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, true);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.ItQa);
    }
}