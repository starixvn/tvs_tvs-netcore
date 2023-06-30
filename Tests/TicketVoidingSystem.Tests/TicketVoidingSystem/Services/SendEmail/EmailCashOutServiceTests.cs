using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail
{
    public class EmailCashOutServiceTests
    {
        private readonly SitesEmailService sitesEmailService;
        private readonly EmailSimpleService emailSimpleService;
        private readonly EmailCashOutServiceImp service;

        public EmailCashOutServiceTests()
        {
            sitesEmailService = Substitute.For<SitesEmailService>();
            emailSimpleService = Substitute.For<EmailSimpleService>();
            service = new EmailCashOutServiceImp(sitesEmailService, emailSimpleService);
        }

        [Fact]
        public void Send_HasCalledSendFormEmailSimpleService()
        {
            // Arrange
            var mailVoidViewModel = new MailVoidViewModel { };
            var sites = new List<SiteEmail> { };
            var tickets = new List<TicketEmailModel>
                { new TicketEmailModel { IsCashOut = true }, new TicketEmailModel { IsCashOut = true } };
            sitesEmailService.GetSiteByName(Arg.Any<IEnumerable<SiteEmail>>(), StringResource.CashOut).ReturnsForAnyArgs(new SiteEmail());

            // Act
            _ = service.Send(mailVoidViewModel, sites, tickets, true);

            // Assert
            emailSimpleService.Received(1).Send(Arg.Any<MailVoidViewModel>(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.CashOut, true);
        }

    }
}
