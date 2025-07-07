using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;

public class UusTicketServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly ValidationTicketServiceImp validationTicketService = new();

    [Fact]
    public void IsValidCashOut_TicketIsNotCashOut_ReturnFalse()
    {
        // Arrange
        var ticket = new TicketEmailModel
        {
            IsCashOut = false
        };

        // Act
        var result = validationTicketService.IsValidCashOut(ticket);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(true, 21, true)]
    [InlineData(false, 21, false)]
    [InlineData(true, 20, false)]
    public void IsValidCashOut_ProdEnvIsTrue_ReturnExpected(bool isCashOut, int currency, bool expected)
    {
        // Arrange
        var ticket = new TicketEmailModel
        {
            IsCashOut = isCashOut,
            Currency = currency
        };
        AppSettingService.AppSetting.LetstalkConfig.IsProdEnv = true;

        // Act
        var result = validationTicketService.IsValidCashOut(ticket);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void IsValidSettledSingleTicket_HasBetTypeIdIsParlayAndBetBuilder_ReturnFalse()
    {
        // Arrange
        var ticket = new TicketEmailModel
        {
            BetTypeId = 1,
            IsCashOut = true
        };

        // Act
        var result = validationTicketService.IsValidSettledSingleTicket(ticket);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsValidSettledSingleTicket_HasTicketIsNotSettled_ReturnFalse()
    {
        // Arrange
        var ticket = new TicketEmailModel
        {
            BetTypeId = 1,
            IsCashOut = false,
            Status = TicketStatus.Running
        };

        // Act
        var result = validationTicketService.IsValidSettledSingleTicket(ticket);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(29)]
    [InlineData(38)]
    public void IsValidSettledSingleTicket_HasTicketIsCashOut_ReturnFalse(int betTypeId)
    {
        // Arrange
        var ticket = new TicketEmailModel
        {
            BetTypeId = betTypeId
        };

        // Act
        var result = validationTicketService.IsValidSettledSingleTicket(ticket);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(29, TicketStatus.Draw, true)]
    [InlineData(38, TicketStatus.Waiting, false)]
    [InlineData(1, TicketStatus.Draw, false)]
    public void IsValidSettledParlayTicket_HasCheckMainParlayIsTrue_ReturnFollowSettled(int betTypeId, string settled,
        bool expected)
    {
        // Arrange
        var ticket = new TicketEmailModel
        {
            BetTypeId = betTypeId,
            Status = settled
        };

        // Act
        var result = validationTicketService.IsValidSettledParlayTicket(ticket, true);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(TicketStatus.Draw, true, true)]
    [InlineData(TicketStatus.Draw, false, false)]
    public void IsValidSettledParlayTicket_HasCheckMixParlayTicket_ReturnFollowCheckMixParlayTicket(string settled,
        bool isMixParlay, bool expected)
    {
        // Arrange
        var ticket = new TicketEmailModel
        {
            SubStatus = settled,
            IsMixParlay = isMixParlay
        };

        // Act
        var result = validationTicketService.IsValidSettledParlayTicket(ticket, false);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(29, 21, true)]
    [InlineData(1, 21, false)]
    [InlineData(29, 20, false)]
    public void IsValidSettledParlayTicket_ProdEnvIsTrue_ReturnExpected(int betTypeId, int currency, bool expected)
    {
        // Arrange
        var ticket = new TicketEmailModel
        {
            Currency = currency,
            BetTypeId = betTypeId,
            Status = TicketStatus.Draw
        };
        AppSettingService.AppSetting.LetstalkConfig.IsProdEnv = true;

        // Act
        var result = validationTicketService.IsValidSettledParlayTicket(ticket, true);

        // Assert
        Assert.Equal(expected, result);
    }
}