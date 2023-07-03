using TicketVoidingSystem.Services;
using Xunit;
using NSubstitute;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services
{
    public class OddsServiceTests
    {
        private readonly RemotingRefWrapperService remotingRefWrapperService;
        private readonly OddsServiceImp service;

        public OddsServiceTests()
        {
            remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
            service = new OddsServiceImp(remotingRefWrapperService);
        }

        [Theory]
        [InlineData(1, 1, 1, 2)]
        [InlineData(1, 1, 5, 100)]
        [InlineData(1, 0, 1, 1)]
        [InlineData(1, 0, 5, 1)]
        public void GetOdds_HasValidData_ReturnExpectedOdds(decimal odds, int betType, int oddsType, decimal expectedOdds)
        {
            // Arrange
            
            // Act
            var actual = service.GetOdds(odds, betType, oddsType);

            // Assert
            Assert.Equal(expectedOdds, actual);
        }

        [Theory]
        [InlineData(1, 1, 1)]
        [InlineData(0, 2, 0)]
        public void GetOddsTypeName_HasValidData_HasCalledGetOddsTypeNameExpected(int betType, int oddsType, int oddsTypeExpected)
        {
            // Arrange

            // Act
            _ = service.GetOddsTypeName(betType, oddsType);

            // Assert
            remotingRefWrapperService.Received(1).GetOddsTypeName(oddsTypeExpected);
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
