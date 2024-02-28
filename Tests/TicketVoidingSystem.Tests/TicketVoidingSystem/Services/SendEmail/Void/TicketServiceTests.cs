using System;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Void;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Void
{
    public class TicketServiceTests
    {
        private readonly BetListCoreService betListCoreService;
        private readonly TicketServiceImp service;

        public TicketServiceTests()
        {
            betListCoreService = Substitute.For<BetListCoreService>();
            service = new TicketServiceImp(betListCoreService);
        }

        [Fact]
        public void GetTicket_ValidData_ReturnTicketEmailViewModel()
        {
            // Arrange
            var item = new TicketEmailModel { TransDate = new DateTime(2022, 2, 2, 2, 2, 2) };
            var match = new Match();
            var site = new SiteEmail();
            betListCoreService.BuildTicket(Arg.Any<TicketEmailModel>(), Arg.Any<Match>(), true)
                .ReturnsForAnyArgs(new TicketEmailViewModel { Stake = "Rebate1" });
            var expected = new TicketEmailViewModel
            {
                Stake = "(Rebate)1",
                BetId = "0",
                TransDate = new DateTime(2022, 2, 2, 2, 2, 2).ToString(FormatKey.LongDateFormatTimeWithSlash),
                WinLoss = "0",
                Score = "",
                BetFrom = "Internet"
            };

            // Act
            var actual = service.GetTicket(item, match, true);

            // Assert
            AssertExtension.Equal(expected, actual);
        }

        [Fact]
        public void GetTicket_HasStatusIsRunning_WinLossIsExpected()
        {
            // Arrange
            var item = new TicketEmailModel { TransDate = new DateTime(2022, 2, 2, 2, 2, 2), Status = TicketStatus.Running };
            var match = new Match();
            var site = new SiteEmail();
            betListCoreService.BuildTicket(Arg.Any<TicketEmailModel>(), Arg.Any<Match>(), true)
                .ReturnsForAnyArgs(new TicketEmailViewModel { Stake = "Rebate1" });

            // Act
            var actual = service.GetTicket(item, match, true);

            // Assert
            Assert.Equal("-", actual.WinLoss);
        }

        [Theory]
        [InlineData(true, 1, true, "123 - 456")]
        [InlineData(true, 29, true, "123 - 456")]
        [InlineData(true, 1, false, "123 - 456")]
        public void GetTicket_HasIsLive_ScoreIsExpected(bool isLive, int betTypeId, bool isMixParlay, string expected)
        {
            // Arrange
            var item = new TicketEmailModel { IsLive = isLive, BetTypeId = betTypeId, IsMixParlay = isMixParlay, LiveHomeScore = 123, LiveAwayScore = 456 };
            var match = new Match();
            var site = new SiteEmail();
            betListCoreService.BuildTicket(Arg.Any<TicketEmailModel>(), Arg.Any<Match>(), true)
                .ReturnsForAnyArgs(new TicketEmailViewModel { Stake = "Rebate1" });

            // Act
            var actual = service.GetTicket(item, match, true);

            // Assert
            Assert.Equal(expected, actual.Score);
        }
    }
}