using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class LeagueNameMessageServiceTests
{
    [Fact]
    public void ReplaceMessageChinaViewLicensee_NotReplace()
    {
        // Arrange
        var message = new Message { ContentEnglish = "123SABA321" };
        var site = new SiteEmail { IsChinaView = true };

        var service = new LeagueNameMessageServiceImp();

        // Act
        service.RemoveSabaOfLeagueName(null, message, site);

        // Assert
        Assert.Equal("123SABA321", message.ContentEnglish);
    }

    [Fact]
    public void ReplaceMessageChinaViewLicensee_ReplaceExpected()
    {
        // Arrange
        var message = new Message { ContentEnglish = "123321", ContentChineseSimplified = "123321" };
        var site = new SiteEmail { IsChinaView = true };
        var match = new Match
        {
            LeagueGroupId = 42,
            LeagueName = "Saba123",
            LeagueNameSimplified = "沙巴123",
            LeagueNameNewSimplified = "沙巴123",
            OriginLeagueName = "Saba123",
            OriginLeagueNameSimplified = "沙巴123",
            OriginLeagueNameNewSimplified = "沙巴123"
        };

        var service = new LeagueNameMessageServiceImp();

        // Act
        service.RemoveSabaOfLeagueName(match, message, site);

        // Assert
        Assert.Equal("123321", message.ContentEnglish);
        Assert.Equal("123321", message.ContentChineseSimplified);
    }

    [Fact]
    public void RemoveSabaInChoiceColumn_LeagueGroupIsNotSaBa_NotReplace()
    {
        // Arrange
        var match = new Match();
        var site = new SiteEmail { IsChinaView = false };
        const string choice = "saba - 123";
        var service = new LeagueNameMessageServiceImp();

        // Act
        var result = service.RemoveSabaInChoiceColumn(choice, match, site);

        // Assert
        Assert.Equal(choice, result);
    }

    [Fact]
    public void RemoveSabaInChoiceColumn_LeagueGroupIsSaBa_ReplaceSaba()
    {
        // Arrange
        var match = new Match { LeagueGroupId = 42, OriginLeagueName = "saba - 123", OriginLeagueNameSimplified = "123" };
        var site = new SiteEmail { IsChinaView = true };
        const string choice = "123 saba - 123";
        var service = new LeagueNameMessageServiceImp();

        // Act
        var result = service.RemoveSabaInChoiceColumn(choice, match, site);

        // Assert
        Assert.Equal("123 - 123", result);
    }
}