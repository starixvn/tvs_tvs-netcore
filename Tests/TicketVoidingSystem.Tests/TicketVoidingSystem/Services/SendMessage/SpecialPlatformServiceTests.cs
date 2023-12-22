using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
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
        var site = new SiteEmail
        {
            IsChinaView = isChinaView,
            SpecialPlatform = specialPlatform
        };
        var match = new Match { LeagueGroupId = leagueGroupId };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.IsTicketSpecialPlatform(match, site);

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
            ContentChineseSimplified = "沙巴123456",
            ContentChineseTraditional = "沙巴123456",
            ContentNewChineseSimplified = "沙巴123456"
            OriginLeagueNameSimplified = "沙巴123",
            OriginLeagueNameNewSimplified = "沙巴123",
            OriginLeagueNameTraditional = "沙巴123"
            ContentChineseSimplified = "123456",
            ContentNewChineseSimplified = "123456",
            ContentChineseTraditional = "123456",
        var site = new SiteEmail
        {
            IsChinaView = isChinaView,
            SpecialPlatform = specialPlatform
        };
        var match = new Match { LeagueGroupId = 42 };
        var service = new SpecialPlatformServiceImp();

        // Act
        var actual = service.IsTicketSpecialPlatform(match, site);

        // Assert
        Assert.True(actual);
    }
}