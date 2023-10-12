using System.Threading.Tasks;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class LeagueNameMessageServiceTests
{
    [Fact]
    public Task ReplaceMessageChinaViewLicensee_NotReplace()
    {
        // Arrange
        var message = new Message { ContentEnglish = "123SABA321" };
        var site = new SiteEmail { IsChinaView = true };

        var service = new LeagueNameMessageServiceImp();

        // Act
        service.RemoveSabaOfLeagueName(null, message, site);

        // Assert
        Assert.Equal("123SABA321", message.ContentEnglish);
        return Task.CompletedTask;
    }

    [Fact]
    public Task ReplaceMessageChinaViewLicensee_ReplaceExpected()
    {
        // Arrange
        var message = new Message { ContentEnglish = "123321", ContentChineseSimplified = "123321" };
        var site = new SiteEmail { IsChinaView = true };
        var match = new Match
        {
            LeagueGroupId = 42, LeagueName = "Saba123", LeagueNameSimplified = "沙巴123",
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
        return Task.CompletedTask;
    }
}