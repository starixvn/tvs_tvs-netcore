using System.Collections.Generic;
using System.Linq;
using Fanex.MailDeliver.MailClient;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendMessage;

public class SpecialPlatformServiceTests
{
    [Fact]
    public void IsSiteSpecialPlatform_MatchIsNull_ReturnFalse()
    {
        // Arrange
        var site = new SiteEmail
        {
            IsChinaView = false
        };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.IsSiteSpecialPlatform(null, site);

        // Assert
        Assert.False(actual);
    }

    [Theory]
    [InlineData(1, true, 0)]
    [InlineData(42, false, 0)]
    public void IsSiteSpecialPlatform_DataNotSiteSpecialPlatform_ReturnFalse(int leagueGroupId, bool isChinaView, int specialPlatform)
    {
        // Arrange
        var site = new SiteEmail
        {
            IsChinaView = isChinaView,
            SpecialPlatform = specialPlatform
        };
        var match = new Match { LeagueGroupId = leagueGroupId };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.IsSiteSpecialPlatform(match, site);

        // Assert
        Assert.False(actual);
    }

    [Theory]
    [InlineData(true, 0)]
    [InlineData(false, 2)]
    [InlineData(false, 3)]
    public void IsSiteSpecialPlatform_DataIsSiteSpecialPlatform_ReturnTrue(bool isChinaView, int specialPlatform)
    {
        // Arrange
        var site = new SiteEmail
        {
            IsChinaView = isChinaView,
            SpecialPlatform = specialPlatform
        };
        var match = new Match { LeagueGroupId = 42 };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.IsSiteSpecialPlatform(match, site);

        // Assert
        Assert.True(actual);
    }

    [Theory]
    [InlineData(1, true, 0)]
    [InlineData(42, false, 0)]
    public void IsTicketSpecialPlatform_DataNotSiteSpecialPlatform_ReturnFalse(int leagueGroupId, bool isChinaView, int specialPlatform)
    {
        // Arrange
        var ticket = new TicketEmailModel { LeagueGroupId = leagueGroupId, IsChinaView = isChinaView, SpecialPlatform = specialPlatform };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.IsTicketSpecialPlatform(ticket);

        // Assert
        Assert.False(actual);
    }

    [Theory]
    [InlineData(true, 0)]
    [InlineData(false, 2)]
    [InlineData(false, 3)]
    public void IsTicketSpecialPlatform_DataIsSiteSpecialPlatform_ReturnTrue(bool isChinaView, int specialPlatform)
    {
        // Arrange
        var ticket = new TicketEmailModel { LeagueGroupId = 42, IsChinaView = isChinaView, SpecialPlatform = specialPlatform };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.IsTicketSpecialPlatform(ticket);

        // Assert
        Assert.True(actual);
    }

    [Fact]
    public void GroupTicketSaba_ValidData_ReturnExpected()
    {
        // Arrange
        var tickets = new List<TicketEmailModel>
        {
            new(){LeagueGroupId = 42, IsChinaView = true, SpecialPlatform = 0},
            new(){LeagueGroupId = 42, IsChinaView = false, SpecialPlatform = 2},
            new(){LeagueGroupId = 42, IsChinaView = false, SpecialPlatform = 3},
            new(){LeagueGroupId = 1, IsChinaView = true, SpecialPlatform = 1}
        };
        var service = new SpecialPlatformServiceImp();

        // Act
        var (normalTickets, specialPlatformTickets) = service.GroupTicketSaba(tickets);

        // Assert
        Assert.Single(normalTickets);
        Assert.Equal(3, specialPlatformTickets.Count());
    }

    [Fact]
    public void RemoveSabaInMessageContent_MatchIsNull_ReturnExpected()
    {
        // Arrange
        var message = new Message
        {
            ContentEnglish = "Saba 123"
        };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.RemoveSabaInMessageContent(null, message);

        // Assert
        AssertExtension.Equal(message, actual);
    }

    [Fact]
    public void RemoveSabaInMessageContent_MatchNotNull_ReturnExpected()
    {
        // Arrange
        var message = new Message
        {
            ContentEnglish = "Saba 123 456",
            ContentChineseSimplified = "沙巴123456",
            ContentChineseTraditional = "沙巴123456",
            ContentNewChineseSimplified = "沙巴123456"
        };
        var match = new Match
        {
            OriginLeagueName = "Saba 123",
            OriginLeagueNameSimplified = "沙巴123",
            OriginLeagueNameTraditional = "沙巴123",
            OriginLeagueNameNewSimplified = "沙巴123"
        };
        var messageExpected = new Message
        {
            ContentEnglish = "123 456",
            ContentChineseSimplified = "123456",
            ContentChineseTraditional = "123456",
            ContentNewChineseSimplified = "123456"
        };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.RemoveSabaInMessageContent(match, message);

        // Assert
        AssertExtension.Equal(messageExpected, actual);
    }

    [Fact]
    public void RemoveSabaInMatchInfo_ValidData_ReturnExpected()
    {
        // Arrange
        var match = new Match
        {
            LeagueName = "Saba 123",
            LeagueNameSimplified = "沙巴123",
            LeagueNameNewSimplified = "沙巴123",
        };
        var matchExpected = new Match
        {
            LeagueName = "123",
            LeagueNameSimplified = "123",
            LeagueNameNewSimplified = "123",
        };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.RemoveSabaInMatchInfo(match);

        // Assert
        AssertExtension.Equal(matchExpected, actual);
    }

    [Theory]
    [InlineData(1, "Pe4", "Pe4")]
    [InlineData(2, "Pe4", "MP")]
    [InlineData(2, "a", "a")]
    public void GetCurrencyNameOfSpecialPlatformTicket_ValidData_ReturnExpected(int specialPlatform, string currencyName, string expected)
    {
        // Arrange
        var ticket = new TicketEmailModel
        {
            SpecialPlatform = specialPlatform,
            CurrencyName = currencyName
        };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.GetCurrencyNameOfSpecialPlatformTicket(ticket);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Theory]
    [InlineData(1, false)]
    [InlineData(2, true)]
    [InlineData(3, true)]
    public void IsSiteJollySportsPlatform_ReturnExpected(int specialPlatform, bool expected)
    {
        // Arrange
        var site = new SiteEmail
        {
            SpecialPlatform = specialPlatform
        };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.IsSiteJollySportsPlatform(site);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void GetDepartmentNameForEmailVoidDuplicated_ReturnExpected()
    {
        // Arrange
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.GetDepartmentNameForEmailVoidDuplicated(new SiteEmail());

        // Assert
        Assert.Equal("Customer Service Team", actual);
    }

    [Theory]
    [InlineData(1, "cs@oneonone-solutions.com")]
    [InlineData(2, "cs@jollysports.com")]
    [InlineData(3, "cs@jollysports.com")]
    public void GetContactAddressForEmailVoidDuplicated_ReturnExpected(int specialPlatform, string expected)
    {
        // Arrange
        var site = new SiteEmail
        {
            SpecialPlatform = specialPlatform
        };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.GetContactAddressForEmailVoidDuplicated(site);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ChangeAppMailIdForSiteJollyPlatform_SiteNotJollySports_UpdateMailIdExpected()
    {
        // Arrange
        var site = new SiteEmail
        {
            SpecialPlatform = 0
        };
        var service = new SpecialPlatformServiceImp();
        var expected = AppSettingService.AppSetting.FanexMailService.AppMailId;
        // Act
        service.ChangeAppMailIdForSiteJollyPlatform(site);

        // Assert
        Assert.Equal(expected, AppSettings.AppMailId);
    }

    [Fact]
    public void ChangeAppMailIdForSiteJollyPlatform_SiteJollySports_UpdateMailIdExpected()
    {
        // Arrange
        var site = new SiteEmail
        {
            SpecialPlatform = 2
        };
        var service = new SpecialPlatformServiceImp();
        var expected = AppSettingService.AppSetting.FanexMailService.AppMailJollySportsId;
        // Act
        service.ChangeAppMailIdForSiteJollyPlatform(site);

        // Assert
        Assert.Equal(expected, AppSettings.AppMailId);
    }

    [Fact]
    public void GetTitleForMailRecord_siteIsJollySports_ReturnExpected()
    {
        // Arrange
        var site = new SiteEmail
        {
            SpecialPlatform = SpecialPlatformConstant.JollySports
        };
        const string expected = "JollySports Notice / 通知";
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.GetTitleForMailRecord(site);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void GetTitleForMailRecord_siteIsNull_ReturnExpected()
    {
        // Arrange
        const string expected = "沙巴体育通知 | Saba Sports Notice";
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.GetTitleForMailRecord(null);

        // Assert
        Assert.Equal(expected, actual);
    }
}