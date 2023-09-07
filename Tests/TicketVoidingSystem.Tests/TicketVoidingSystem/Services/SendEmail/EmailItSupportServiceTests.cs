using System.Collections.Generic;
using Fanex.MailDeliver.Model;
using Force.DeepCloner;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Void;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class EmailItSupportServiceTests
{
    private readonly EmailSimpleService emailSimpleService;
    private readonly EmailItSupportServiceImp service;
    private readonly SitesEmailService sitesEmailService;
    private readonly VoidEmailContentService voidEmailContentService;

    public EmailItSupportServiceTests()
    {
        sitesEmailService = Substitute.For<SitesEmailService>();
        emailSimpleService = Substitute.For<EmailSimpleService>();
        voidEmailContentService = Substitute.For<VoidEmailContentService>();
        service = new EmailItSupportServiceImp(sitesEmailService, emailSimpleService, voidEmailContentService);
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
        voidEmailContentService.Create(mailVoidViewModel.DeepClone(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.ItSupport, isFromAfterVoidService)
            .Returns(new MailRecord());

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, isFromAfterVoidService);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.ItSupport);
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
        voidEmailContentService.Create(mailVoidViewModel.DeepClone(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.ItSupport, isFromAfterVoidService)
            .Returns(new MailRecord());

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, isFromAfterVoidService);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.ItSupport);
    }

    [Fact]
    public void Send_NoHasUusTickets()
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel();
        var sites = new List<SiteEmail>();
        var tickets = new List<TicketEmailModel> { new() { IsItSupport = true, Currency = 20 }, new() { IsItSupport = false, Currency = 1 } };
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItSupport)
            .ReturnsForAnyArgs(new SiteEmail());
        voidEmailContentService.Create(mailVoidViewModel.DeepClone(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.ItSupport, true)
            .Returns(new MailRecord());

        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, true);

        // Assert
        emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.ItSupport);
    }

}