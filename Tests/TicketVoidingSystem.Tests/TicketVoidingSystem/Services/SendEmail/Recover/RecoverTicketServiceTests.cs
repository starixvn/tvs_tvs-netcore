using System;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Recover;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Recover;

public class RecoverTicketServiceTests
{
    [Theory]
    [InlineData(29, true, "2 - 1", "Running", "-")]
    [InlineData(1, false, "", "Done", "0")]
    public void Render_returnExpected(int betType, bool isLiveIndicator, string score, string status, string winLost)
    {
        // Arrange
        var item = new TicketRecoverEmailModel
        {
            BetType = betType,
            TransId = 1,
            UserName = "a",
            TransDate = DateTimeOffset.Now.DateTime,
            Status = status,
            LiveHomeScore = 2,
            LiveAwayScore = 1,
            IsLiveIndicator = isLiveIndicator
        };
        var ticket = new TicketRecoverEmailViewModel();
        var expected = new TicketRecoverEmailViewModel
        {
            BetId = "1",
            Player = "a",
            TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash),
            WinLost = winLost,
            Score = score,
        };
        var betListService = Substitute.For<BetListCoreService>();
        betListService.GetMainParlayTicket(item).ReturnsForAnyArgs(ticket);
        betListService.GetNormalTicket(item).ReturnsForAnyArgs(ticket);
        var service = new RecoverTicketServiceImp(betListService);

        // Act
        var actual = service.Render(item);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}