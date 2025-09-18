using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.MailDeliver.MailClient.Model;
using NSubstitute;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;

public class DuplicateTicketsEmailItSupportServiceTests
{
    private DuplicateTicketsEmailContentService emailContentService;
    private EmailSimpleService emailSimpleService;
    private SitesEmailService sitesEmailService;

    internal void InItFakeServiceTests()
    {
        sitesEmailService = Substitute.For<SitesEmailService>();
        emailSimpleService = Substitute.For<EmailSimpleService>();
        emailContentService = Substitute.For<DuplicateTicketsEmailContentService>();
    }

    [Fact]
    public async Task Send_HasDuplicateTickets_CallExpected()
    {
        // Arrange
        InItFakeServiceTests();
        var duplicateTickets = new List<DuplicateTicketsRequestInfo>
        {
            new() { IsItSupport = true, IsITSupportCreatedRequest = true, IsHasUusTickets = false },
            new() { IsItSupport = true, IsITSupportCreatedRequest = true, IsHasUusTickets = true },
            new() { IsItSupport = true, IsITSupportCreatedRequest = false, IsHasUusTickets = false },
            new() { IsItSupport = true, IsITSupportCreatedRequest = false, IsHasUusTickets = true },
            new() { IsItSupport = false, IsITSupportCreatedRequest = true, IsHasUusTickets = false },
            new() { IsItSupport = false, IsITSupportCreatedRequest = true, IsHasUusTickets = true },
            new() { IsItSupport = false, IsITSupportCreatedRequest = false, IsHasUusTickets = true },
            new() { IsItSupport = false, IsITSupportCreatedRequest = false, IsHasUusTickets = false }
        };
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItQa)
            .ReturnsForAnyArgs(new SiteEmail());
        emailContentService.Create(Arg.Any<DuplicateTicketsMailVoidViewModel>(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<DuplicateTicketsRequestInfo>>(), EmailGroup.ItSupport)
            .ReturnsForAnyArgs(new MailRecord());
        var service =
            new DuplicateTicketsEmailItSupportServiceImp(sitesEmailService, emailSimpleService,
                emailContentService);
        // Act
        await service.Send(null, null, duplicateTickets);

        // Assert
        sitesEmailService.Received(1).GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItQa);
        emailContentService.Received(1).Create(Arg.Any<DuplicateTicketsMailVoidViewModel>(), Arg.Any<SiteEmail>(),
            Arg.Any<IEnumerable<DuplicateTicketsRequestInfo>>(), EmailGroup.ItSupport);
        await emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.ItSupport);
    }

    [Fact]
    public async Task Send_NoHasDuplicateTickets_CallExpected()
    {
        // Arrange
        InItFakeServiceTests();
        var duplicateTickets = new List<DuplicateTicketsRequestInfo>();
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItQa)
            .ReturnsForAnyArgs(new SiteEmail());
        emailContentService.Create(Arg.Any<DuplicateTicketsMailVoidViewModel>(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<DuplicateTicketsRequestInfo>>(), EmailGroup.ItSupport)
            .ReturnsForAnyArgs(new MailRecord());
        var service =
            new DuplicateTicketsEmailItSupportServiceImp(sitesEmailService, emailSimpleService,
                emailContentService);
        // Act
        await service.Send(null, null, duplicateTickets);

        // Assert
        sitesEmailService.Received(1).GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItQa);
        emailContentService.Received(1).Create(Arg.Any<DuplicateTicketsMailVoidViewModel>(), Arg.Any<SiteEmail>(),
            Arg.Any<IEnumerable<DuplicateTicketsRequestInfo>>(), EmailGroup.ItSupport);
        await emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.ItSupport);
    }
}