using System.Collections.Generic;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail
{
    public class SitesEmailServiceTests: IClassFixture<AppSettingFixture>
    {
        private readonly IDynamicRepository repository;
        private readonly SitesEmailServiceImp service;

        public SitesEmailServiceTests()
        {
            repository = Substitute.For<IDynamicRepository>();
            service = new SitesEmailServiceImp(repository);
        }

        [Fact]
        public void GetSiteByName_ValidData_ReturnSiteEmail()
        {
            // Arrange
            var sites = new List<SiteEmail> { new SiteEmail { Site = "1" }, new SiteEmail { Site = "0x98967F" } };
            var expected = new SiteEmail { Site = "1" };

            // Act
            var actual = service.GetSiteByName(sites, "1");

            // Assert
            AssertExtension.Equal(expected, actual);
        }

        [Fact]
        public void GetSiteByName_NoHasSiteEmailValid_ReturnNewSiteEmail()
        {
            // Arrange
            var sites = new List<SiteEmail> { new SiteEmail { Site = "1" }, new SiteEmail { Site = "0x98967F" } };
            var expected = new SiteEmail ();

            // Act
            var actual = service.GetSiteByName(sites, "2");

            // Assert
            AssertExtension.Equal(expected, actual);
        }
    }
}
