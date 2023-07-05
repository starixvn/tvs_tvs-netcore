using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class EmailItQaServiceTests
{
    private readonly EmailSimpleService emailSimpleService;
    private readonly EmailItQaServiceImp service;
    private readonly SitesEmailService sitesEmailService;

    public EmailItQaServiceTests()
    {
        sitesEmailService = Substitute.For<SitesEmailService>();
        emailSimpleService = Substitute.For<EmailSimpleService>();
        service = new EmailItQaServiceImp(sitesEmailService, emailSimpleService);
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

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, true);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailVoidViewModel>(), Arg.Any<SiteEmail>(),
            Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.ItQa, true);
    }
}