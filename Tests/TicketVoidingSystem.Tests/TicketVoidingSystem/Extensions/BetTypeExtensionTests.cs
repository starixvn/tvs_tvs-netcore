using System.Collections.Generic;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.Extensions
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

        [Fact]
        public void IsBitCoin_IdMatchesBitCoinOverUnder_ReturnTrue()
        {
            // Arrange
            int id = BetTypeConstant.BitCoinOverUnder;

            // Act
            bool result = id.IsBitCoin();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsBitCoin_IdDoesNotMatchBitCoinOverUnder_ReturnFalse()
        {
            // Arrange
            int id = 123;

            // Act
            bool result = id.IsBitCoin();

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData(17000)]
        [InlineData(17003)]
        public void IsSabaPromotion_IdMatchesSabaPromotion_ReturnTrue(int id)
        {
            // Arrange

            // Act
            bool result = id.IsSabaPromotion();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsSabaPromotion_IdDoesNotMatchSabaPromotion_ReturnFalse()
        {
            // Arrange
            int id = 123;

            // Act
            bool result = id.IsSabaPromotion();

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsOutright_IdIsOutright_ReturnTrue()
        {
            // Arrange
            int id = BetTypeConstant.Outright;

            // Act
            bool result = id.IsOutright();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsOutright_IdIsNotOutright_ReturnTrue()
        {
            // Arrange
            int id = 123;

            // Act
            bool result = id.IsOutright();

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData(BetTypeConstant.FirstVirtualSport)]
        [InlineData(2702)]
        [InlineData(BetTypeConstant.SecondVirtualSport)]
        [InlineData(BetTypeConstant.MinVirtualSportBetType)]
        [InlineData(1208)]
        [InlineData(BetTypeConstant.MaxVirtualSportBetType)]
        public void IsVirtualSportBetType_IdIsVirtualSportBetType_ReturnTrue(int id)
        {
            // Arrange

            // Act
            bool result = id.IsVirtualSportBetType();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsVirtualSportBetType_IdIsNotVirtualSportBetType_ReturnFalse()
        {
            // Arrange
            int id = 123;

            // Act
            bool result = id.IsVirtualSportBetType();

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData(29)]
        [InlineData(38)]
        [InlineData(BetTypeConstant.FirstNumberGame)]
        [InlineData(BetTypeConstant.SecondNumberGame)]
        [InlineData(115)]
        [InlineData(BetTypeConstant.FirstLucky3)]
        [InlineData(BetTypeConstant.SecondLucky3)]
        [InlineData(1605)]
        public void HideScore_IdIsHideScore_ReturnTrue(int id)
        {
            // Arrange

            // Act
            bool result = id.HideScore();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void HideScore_IdIsNotHideScore_ReturnFalse()
        {
            // Arrange
            int id = 11;

            // Act
            bool result = id.HideScore();

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData(29)]
        [InlineData(38)]
        [InlineData(BetTypeConstant.FirstNumberGame)]
        [InlineData(BetTypeConstant.SecondNumberGame)]
        [InlineData(115)]
        [InlineData(BetTypeConstant.FirstLucky3)]
        [InlineData(BetTypeConstant.SecondLucky3)]
        [InlineData(1605)]
        public void IsHideHandicap_IdIsIsHideHandicap_ReturnTrue(int id)
        {
            // Arrange

            // Act
            bool result = id.IsHideHandicap();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsHideHandicap_IdIsNotIsHideHandicap_ReturnFalse()
        {
            // Arrange
            int id = 11;

            // Act
            bool result = id.IsHideHandicap();

            // Assert
            Assert.False(result);
        }
    }
}
