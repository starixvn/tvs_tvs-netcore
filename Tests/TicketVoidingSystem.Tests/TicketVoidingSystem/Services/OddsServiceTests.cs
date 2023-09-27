using TicketVoidingSystem.Services;
using Xunit;
using NSubstitute;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services
{
    public class OddsServiceTests
    {
        private readonly OddsServiceImp service;

        public OddsServiceTests()
        {
            Substitute.For<RemotingRefWrapperService>();
            service = new OddsServiceImp();
        }

        [Theory]
        [InlineData("<span>a</span><span>b</span>", "b")]
        [InlineData("<span>a</span>", "")]
        public void GetOddsName_HasValidData_ReturnOddsName(string oddsHtml, string expected)
        {
            // Arrange

            // Act
            var actual = service.GetOddsName(oddsHtml);

            // Assert
            Assert.Equal(expected, actual);
        }
    }
}
