using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail
{
    public class SendEmailServiceTests
    {
        private readonly SitesEmailService sitesEmailService;
        private readonly EmailLicenseeService emailLicenseeService;
        private readonly EmailCashOutService emailCashOutService;
        private readonly EmailItQaService emailItQaService;
        private readonly EmailItSupportService emailItSupportService;
        private readonly SendEmailServiceImp service;

        public SendEmailServiceTests()
        {
            sitesEmailService = Substitute.For<SitesEmailService>();
            emailLicenseeService = Substitute.For<EmailLicenseeService>();
            emailCashOutService = Substitute.For<EmailCashOutService>();
            emailItQaService = Substitute.For<EmailItQaService>();
            emailItSupportService = Substitute.For<EmailItSupportService>();

            service = new SendEmailServiceImp(
                sitesEmailService,
                emailLicenseeService,
                emailCashOutService,
                emailItQaService,
                emailItSupportService
            );
        }

        [Fact]
        public async Task SendEmail_ReturnsResultsFromEmailServices()
        {
            // Arrange
            var model = new EmailVoidModel();
            var tickets = new List<TicketEmailModel>();
            var expectedResults = new List<Result>();

            sitesEmailService.GetSitesByCategory(Arg.Any<bool>()).Returns(new List<SiteEmail>());

            // Act
            var results = await service.SendEmail(model, tickets, true);

            // Assert
            AssertExtension.Equal(expectedResults, results);
        }


    }
}
