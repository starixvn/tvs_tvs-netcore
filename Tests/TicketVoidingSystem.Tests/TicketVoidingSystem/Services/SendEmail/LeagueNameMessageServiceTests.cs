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
        var message = new Message { ContentEnglish = "123321" };
        var site = new SiteEmail { IsChinaView = true };

        var service = new LeagueNameMessageServiceImp();

        // Act
        service.RemoveSabaOfLeagueName(new Match { LeagueGroupId = 42 }, message, site);

        // Assert
        Assert.Equal("123321", message.ContentEnglish);
        return Task.CompletedTask;
    }
}