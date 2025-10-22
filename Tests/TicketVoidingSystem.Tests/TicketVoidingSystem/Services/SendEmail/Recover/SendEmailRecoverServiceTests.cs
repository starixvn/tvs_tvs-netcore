using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.MailDeliver.MailClient.Model;
using NSubstitute;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Recover;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Recover;

public class SendEmailRecoverServiceTests
{
    [Fact]
    public async Task SendEmail_ValidData_CallExpected()
    {
        // Arrange
        var tickets = new List<TicketRecoverEmailModel>
        {
            new() { IsCsd  = true},
            new() { IsItQa  = true},
            new() { IsItSupport  = true}
        };
        var sites = new List<SiteEmail> { new() };
        var sitesEmailService = Substitute.For<SitesEmailService>();
        var recoverEmailContentService = Substitute.For<RecoverEmailContentService>();
        var emailSimpleService = Substitute.For<EmailSimpleService>();
        sitesEmailService.GetSites().ReturnsForAnyArgs(sites);
        sitesEmailService.GetSiteByName(sites, StringResource.CsdRecovery).Returns(new SiteEmail());
        sitesEmailService.GetSiteByName(sites, StringResource.ItQa).Returns(new SiteEmail());
        sitesEmailService.GetSiteByName(sites, StringResource.ItSupport).Returns(new SiteEmail());
        recoverEmailContentService.Create(Arg.Any<MailRecoverViewModel>(), Arg.Any<IEnumerable<TicketRecoverEmailModel>>(), Arg.Any<SiteEmail>(), EmailGroup.Recover)
            .ReturnsForAnyArgs(new MailRecord());
        var service = new SendEmailRecoverServiceImp(sitesEmailService, recoverEmailContentService, emailSimpleService);

        // Act
        await service.SendEmail(null, tickets);

        // Assert
        sitesEmailService.Received(1).GetSiteByName(sites, StringResource.CsdRecovery);
        sitesEmailService.Received(1).GetSiteByName(sites, StringResource.ItQa);
        sitesEmailService.Received(1).GetSiteByName(sites, StringResource.ItSupport);
        await emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.Recover);
        await emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.ItQa);
        await emailSimpleService.Received(1).Send(Arg.Any<MailRecord>(), EmailGroup.ItSupport);
    }
}