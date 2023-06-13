using System.Collections.Generic;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Extensions.Tests
{
    public class BetTypeExtensionTests
    {
        [Theory]
        [InlineData(29, true)]
        [InlineData(10, false)]
        public void IsParlay_ReturnsExpectedValue(int id, bool expected)
        {
            // Arrange

            // Act
            var result = id.IsParlay();

            // Assert
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData(29, true)]
        [InlineData(38, true)]
        [InlineData(10, false)]
        public void IsParlayAndBetBuilder_ReturnsExpectedValue(int id, bool expected)
        {
            // Arrange

            // Act
            var result = id.IsParlayAndBetBuilder();

            // Assert
            Assert.Equal(expected, result);
        }

        // Add more test cases for the other extension methods...

        [Theory]
        [InlineData("Next", "下一个")]
        [InlineData("Hello", "Hello")]
        public void TranslateChineseSimplified_ReturnsExpectedValue(string name, string expected)
        {
            // Arrange

            // Act
            var result = name.TranslateChineseSimplified();

            // Assert
            Assert.Equal(expected, result);
        }

        // Add more test cases for the other extension methods...

        [Fact]
        public void ToXml_ReturnsExpectedXmlString()
        {
            // Arrange
            var betTypes = new List<BetTypeXml>
            {
                new BetTypeXml { Id = 1, BetTeam = "TeamA", Set = "1", Game = "2", Value = "3", ValueHdp1 = "4", ValueHdp2 = "5", Goal = "6", BetOption = "OptionA", OddsSpread = "7", OddsId = "8", Transdesc = "Description" },
                new BetTypeXml { Id = 2, BetTeam = "TeamB", Set = "1", Game = "2", Value = "3", ValueHdp1 = "4", ValueHdp2 = "5", Goal = "6", BetOption = "OptionB", OddsSpread = "7", OddsId = "8", Transdesc = "Description" }
            };

            var expectedXml = "<BetTypes>" +
                              "\r\n<BetType Id=\"1\" BetTeam=\"TeamA\" Set=\"1\" Game=\"2\" Value=\"3\" ValueHdp1=\"4\" ValueHdp2=\"5\" Goal=\"6\" BetOption=\"OptionA\" OddsSpread=\"7\" OddsId=\"8\" Transdesc=\"Description\" />" +
                              "\r\n<BetType Id=\"2\" BetTeam=\"TeamB\" Set=\"1\" Game=\"2\" Value=\"3\" ValueHdp1=\"4\" ValueHdp2=\"5\" Goal=\"6\" BetOption=\"OptionB\" OddsSpread=\"7\" OddsId=\"8\" Transdesc=\"Description\" />" +
                              "\r\n</BetTypes>";

            // Act
            var result = betTypes.ToXml();

            // Assert
            Assert.Equal(expectedXml, result);
        }
    }
}
