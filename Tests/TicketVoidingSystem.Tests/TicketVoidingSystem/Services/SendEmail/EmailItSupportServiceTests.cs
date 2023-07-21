using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class EmailItSupportServiceTests
{
    private readonly EmailSimpleService emailSimpleService;
    private readonly EmailItSupportServiceImp service;
    private readonly SitesEmailService sitesEmailService;

    public EmailItSupportServiceTests()
    {
        sitesEmailService = Substitute.For<SitesEmailService>();
        emailSimpleService = Substitute.For<EmailSimpleService>();
        service = new EmailItSupportServiceImp(sitesEmailService, emailSimpleService);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void Send_HasCalledSendFormEmailSimpleService(bool isFromAfterVoidService)
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel();
        var sites = new List<SiteEmail>();
        var tickets = new List<TicketEmailModel>
        {
            new()
            {
                IsITSupportCreatedRequest = true,
                IsItSupport = true,
                Currency = 1
            },
            new()
            {
                IsITSupportCreatedRequest = true,
                IsItSupport = false,
                Currency = 1
            },
            new()
            {
                IsITSupportCreatedRequest = true,
                IsItSupport = true,
                Currency = 20
            },
            new()
            {
                IsITSupportCreatedRequest = false,
                IsItSupport = true,
                Currency = 1
            },
            new()
            {
                IsITSupportCreatedRequest = false,
                IsItSupport = true,
                Currency = 20
            },
            new()
            {
                IsITSupportCreatedRequest = false,
                IsItSupport = false,
                Currency = 20
            }
        };
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItSupport)
            .ReturnsForAnyArgs(new SiteEmail());

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, isFromAfterVoidService);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailVoidViewModel>(), Arg.Any<SiteEmail>(),
            Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.ItSupport, isFromAfterVoidService);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void Send_NoHasTicketITSupportCreatedRequest(bool isFromAfterVoidService)
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel();
        var sites = new List<SiteEmail>();
        var tickets = new List<TicketEmailModel>
        {
            new()
            {
                IsITSupportCreatedRequest = true,
                IsItSupport = true,
                Currency = 20
            },
            new()
            {
                IsITSupportCreatedRequest = true,
                IsItSupport = false,
                Currency = 1
            },
            new()
            {
                IsITSupportCreatedRequest = false,
                IsItSupport = true,
                Currency = 1
            },
            new()
            {
                IsITSupportCreatedRequest = false,
                IsItSupport = false,
                Currency = 20
            },
        };
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItSupport)
            .ReturnsForAnyArgs(new SiteEmail());

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, isFromAfterVoidService);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailVoidViewModel>(), Arg.Any<SiteEmail>(),
            Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.ItSupport, isFromAfterVoidService);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void Send_NoHasTicket(bool isFromAfterVoidService)
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel();
        var sites = new List<SiteEmail>();
        var tickets = new List<TicketEmailModel>();
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItSupport)
            .ReturnsForAnyArgs(new SiteEmail());

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, isFromAfterVoidService);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailVoidViewModel>(), Arg.Any<SiteEmail>(),
            Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.ItSupport, isFromAfterVoidService);
    }

    [Fact]
    public void Send_NoHasUusTickets()
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel();
        var sites = new List<SiteEmail>();
        var tickets = new List<TicketEmailModel>{ new (){ IsItSupport  = false, Currency = 20} };
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItSupport)
            .ReturnsForAnyArgs(new SiteEmail());

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, true);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailVoidViewModel>(), Arg.Any<SiteEmail>(),
            Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.ItSupport, true);
    }

}