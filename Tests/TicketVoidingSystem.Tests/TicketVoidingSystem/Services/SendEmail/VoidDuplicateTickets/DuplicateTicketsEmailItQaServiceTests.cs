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

public class DuplicateTicketsEmailItQaServiceTests
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
    public async Task Send_ValidData_CallExpected()
    {
        // Arrange
        InItFakeServiceTests();
        var duplicateTickets = new List<DuplicateTicketsRequestInfo>
        {
            new() { IsHasUusTickets = false },
            new() { IsHasUusTickets = true }
        };
        sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItQa)
            .ReturnsForAnyArgs(new SiteEmail());
        emailContentService.Create(Arg.Any<DuplicateTicketsMailVoidViewModel>(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<DuplicateTicketsRequestInfo>>(), EmailGroup.ItSupport)
            .ReturnsForAnyArgs(new MailRecord());
        var service =
            new DuplicateTicketsEmailItQaServiceImp(sitesEmailService, emailSimpleService,
                emailContentService);
        // Act
        await service.Send(null, null, duplicateTickets);

        // Assert
        sitesEmailService.Received(1).GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.ItQa);
        emailContentService.Received(1).Create(Arg.Any<DuplicateTicketsMailVoidViewModel>(), Arg.Any<SiteEmail>(),
            Arg.Any<IEnumerable<DuplicateTicketsRequestInfo>>(), EmailGroup.ItQa);
        await emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.ItQa);
    }
}