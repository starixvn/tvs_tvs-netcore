using System;
using System.Collections.Generic;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions;

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

    [Fact]
    public void ToXml_ReturnsExpectedXmlString()
    {
        // Arrange
        var betTypes = new List<BetTypeXml>
        {
            new()
            {
                Id = 1, BetTeam = "TeamA", Set = "1", Game = "2", Value = "3", ValueHdp1 = "4", ValueHdp2 = "5",
                Goal = "6", BetOption = "OptionA", OddsSpread = "7", OddsId = "8", Transdesc = "Description"
            },
            new()
            {
                Id = 2, BetTeam = "TeamB", Set = "1", Game = "2", Value = "3", ValueHdp1 = "4", ValueHdp2 = "5",
                Goal = "6", BetOption = "OptionB", OddsSpread = "7", OddsId = "8", Transdesc = "Description"
            }
        };

        var expectedXml = "<BetTypes>" +
                          $"{Environment.NewLine}<BetType Id=\"1\" BetTeam=\"TeamA\" Set=\"1\" Game=\"2\" Value=\"3\" ValueHdp1=\"4\" ValueHdp2=\"5\" Goal=\"6\" BetOption=\"OptionA\" OddsSpread=\"7\" OddsId=\"8\" Transdesc=\"Description\" VirtualHead=\"All\" />" +
                          $"{Environment.NewLine}<BetType Id=\"2\" BetTeam=\"TeamB\" Set=\"1\" Game=\"2\" Value=\"3\" ValueHdp1=\"4\" ValueHdp2=\"5\" Goal=\"6\" BetOption=\"OptionB\" OddsSpread=\"7\" OddsId=\"8\" Transdesc=\"Description\" VirtualHead=\"All\" />" +
                          $"{Environment.NewLine}</BetTypes>";

        // Act
        var result = betTypes.ToXml();

        // Assert
        Assert.Equal(expectedXml, result);
    }

    [Fact]
    public void IsBitCoin_IdMatchesBitCoinOverUnder_ReturnTrue()
    {
        // Arrange
        const int id = BetTypeConstant.BitCoinOverUnder;

        // Act
        var result = id.IsBitCoin();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsBitCoin_IdDoesNotMatchBitCoinOverUnder_ReturnFalse()
    {
        // Arrange
        const int id = 123;

        // Act
        var result = id.IsBitCoin();

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(17003)]
    [InlineData(17004)]
    [InlineData(17006)]
    public void IsSabaPromotion_IdMatchesSabaPromotion_ReturnTrue(int id)
    {
        // Arrange
        // Act
        var result = id.IsSabaPromotion();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsSabaPromotion_IdDoesNotMatchSabaPromotion_ReturnFalse()
    {
        // Arrange
        const int id = 123;

        // Act
        var result = id.IsSabaPromotion();

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsOutright_IdIsOutright_ReturnTrue()
    {
        // Arrange
        const int id = BetTypeConstant.Outright;

        // Act
        var result = id.IsOutright();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsOutright_IdIsNotOutright_ReturnTrue()
    {
        // Arrange
        const int id = 123;

        // Act
        var result = id.IsOutright();

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
    [InlineData(10400)]
    [InlineData(10449)]
    public void IsVirtualSportBetType_IdIsVirtualSportBetType_ReturnTrue(int id)
    {
        // Arrange
        // Act
        var result = id.IsVirtualSportBetType();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsVirtualSportBetType_IdIsNotVirtualSportBetType_ReturnFalse()
    {
        // Arrange
        const int id = 123;

        // Act
        var result = id.IsVirtualSportBetType();

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
        var result = id.HideScore();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void HideScore_IdIsNotHideScore_ReturnFalse()
    {
        // Arrange
        const int id = 11;

        // Act
        var result = id.HideScore();

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
    [InlineData(10449)]
    [InlineData(BetTypeConstant.VirtualSportParlay)]
    public void IsHideHandicap_IdIsIsHideHandicap_ReturnTrue(int id)
    {
        // Arrange
        // Act
        var result = id.IsHideHandicap();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsHideHandicap_IdIsNotIsHideHandicap_ReturnFalse()
    {
        // Arrange
        const int id = 11;

        // Act
        var result = id.IsHideHandicap();

        // Assert
        Assert.False(result);
    }
}