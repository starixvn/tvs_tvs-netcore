using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using Settlement.Business.Core.Constants;
using Settlement.Business.Core.Models;
using Settlement.Business.Services;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;
using TicketVoidingSystem.Constants;
using Xunit;
using static Settlement.Business.Core.Constants.Status;
using SettlementResources = Settlement.Business.Core.Models.Resources;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing
{
    public class CalculateServiceTest
    {
        private readonly ModdsService moddsService;
        private readonly TicketValueService ticketValueService;
        private readonly WinLimitService winLimitService;
        private readonly CalculateServiceImp calculateService;

        public CalculateServiceTest()
        {
            moddsService = Substitute.For<ModdsService>();
            ticketValueService = Substitute.For<TicketValueService>();
            winLimitService = Substitute.For<WinLimitService>();
            calculateService = new CalculateServiceImp(
                moddsService,
                ticketValueService,
                winLimitService);
        }

        [Fact]
        public void ResetToRunning_ShouldResetTicketsToRunningStatus()
        {
            // Arrange
            var tickets = new List<TicketsBetTransModel>
            {
                new()
                {
                    StatusWinLost = 1,
                    WinLost = 100m,
                    Status = "Won",
                    StatusId = 1,
                    Ruben = 10,
                    Creator = 1,
                    CreatorBackUp = 2
                }
            };

            // Act
            var result = calculateService.ResetToRunning(tickets);

            // Assert
            Assert.All(result, ticket =>
            {
                Assert.Null(ticket.StatusWinLost);
                Assert.Equal(0m, ticket.WinLost);
                Assert.Equal(TicketStatus.Running, ticket.Status);
                Assert.Equal(TicketStatus.RunningId, ticket.StatusId);
                Assert.Equal(2, ticket.Creator);
            });
        }

        [Fact]
        public void Refund_ShouldSetTicketsToRefundStatus()
        {
            // Arrange
            var tickets = new List<TicketsBetTransModel>
            {
                new()
                {
                    ActualStake = 100m,
                    AWinLost = 10m,
                    MWinLost = 20m,
                    SWinLost = 30m,
                    PlayerComm = 5m,
                    Comm = 15m,
                    AComm = 25m,
                    SComm = 35m
                }
            };

            // Act
            var result = calculateService.Refund(tickets);

            // Assert
            Assert.All(result, ticket =>
            {
                Assert.Equal(100m, ticket.WinLost);
                Assert.Equal(0m, ticket.AWinLost);
                Assert.Equal(0m, ticket.MWinLost);
                Assert.Equal(0m, ticket.SWinLost);
                Assert.Equal(0m, ticket.PlayerComm);
                Assert.Equal(0m, ticket.Comm);
                Assert.Equal(0m, ticket.AComm);
                Assert.Equal(0m, ticket.SComm);
                Assert.Equal(Ruben.Default, ticket.Ruben);
                Assert.Equal(StatusWinlost.Refund, ticket.StatusWinLost);
                Assert.Equal(StatusId.Refund, ticket.StatusId);
                Assert.Equal(StatusName.Refund, ticket.Status);
            });
        }

        [Fact]
        public async Task Settle_ShouldSettleTicketsCorrectly()
        {
            // Arrange
            var tickets = new List<TicketsBetTransModel>
            {
                new()
                {
                    ProfileId = 1,
                    Odds = 2.0m,
                    ActualStake = 100m,
                    Stake = 50m
                }
            };

            var outright = new List<Outright>();
            var resources = new List<SettlementResources>
            {
                new() { ProfileId = 1, OddsType = 1 }
            };

            moddsService.VirtualRacing(Arg.Any<TicketsBetTransModel>(), Arg.Any<List<Outright>>())
                .Returns(2);

            ticketValueService.GetActualPayout(2.0m, 2.0m, 1, 100m, 50m)
                .Returns(200m);

            winLimitService.GetMaxWinLimit(Arg.Any<List<TicketsBetTransModel>>())
                .Returns(Task.FromResult<IEnumerable<WinLimit>>(new List<WinLimit>()));

            // Act
            var result = await calculateService.Settle(tickets, outright, resources);

            // Assert
            Assert.All(result, ticket =>
            {
                Assert.Equal(2.0m, ticket.Modds);
                Assert.Equal((short)1, ticket.OddsType);
                Assert.Equal(200m, ticket.ActualPayout);
            });

            ticketValueService.Received(1)
                .SetValue(Arg.Any<TicketsBetTransModel>(), Arg.Any<List<WinLimit>>());
        }

        [Fact]
        public async Task Settle_WithNoMatchingResource_ShouldUseEmptyResource()
        {
            // Arrange
            var tickets = new List<TicketsBetTransModel>
            {
                new()
                {
                    ProfileId = 999,
                    Odds = 3.0m,
                    ActualStake = 200m,
                    Stake = 100m
                }
            };

            var outright = new List<Outright>();
            var resources = new List<SettlementResources>
            {
                new() { ProfileId = 1, OddsType = 1 }
            };

            moddsService.VirtualRacing(Arg.Any<TicketsBetTransModel>(), Arg.Any<List<Outright>>())
                .Returns(3);

            ticketValueService.GetActualPayout(3.0m, 3.0m, 0, 200m, 100m)
                .Returns(600m);

            winLimitService.GetMaxWinLimit(Arg.Any<List<TicketsBetTransModel>>())
                .Returns(Task.FromResult<IEnumerable<WinLimit>>(new List<WinLimit>()));

            // Act
            var result = await calculateService.Settle(tickets, outright, resources);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(3.0m, result[0].Modds);
            Assert.Equal(0, result[0].OddsType);
            Assert.Equal(600m, result[0].ActualPayout);

            ticketValueService.Received(1)
                .SetValue(Arg.Any<TicketsBetTransModel>(), Arg.Any<List<WinLimit>>());
        }

        [Fact]
        public async Task Settle_MultipleTickets_ShouldProcessAllTicketsCorrectly()
        {
            // Arrange
            var tickets = new List<TicketsBetTransModel>
            {
                new()
                {
                    ProfileId = 1,
                    Odds = 2.0m,
                    ActualStake = 100m,
                    Stake = 50m
                },
                new()
                {
                    ProfileId = 2,
                    Odds = 3.0m,
                    ActualStake = 200m,
                    Stake = 100m
                }
            };

            var outright = new List<Outright>();
            var resources = new List<SettlementResources>
            {
                new() { ProfileId = 1, OddsType = 1 },
                new() { ProfileId = 2, OddsType = 1 }
            };

            moddsService.VirtualRacing(Arg.Is<TicketsBetTransModel>(t => t.ProfileId == 1), Arg.Any<List<Outright>>())
                .Returns(2);
            moddsService.VirtualRacing(Arg.Is<TicketsBetTransModel>(t => t.ProfileId == 2), Arg.Any<List<Outright>>())
                .Returns(3);

            ticketValueService.GetActualPayout(2.0m, 2.0m, 1, 100m, 50m)
                .Returns(200m);
            ticketValueService.GetActualPayout(3.0m, 3.0m, 1, 200m, 100m)
                .Returns(600m);

            winLimitService.GetMaxWinLimit(Arg.Any<List<TicketsBetTransModel>>())
                .Returns(Task.FromResult<IEnumerable<WinLimit>>(new List<WinLimit>()));

            // Act
            var result = await calculateService.Settle(tickets, outright, resources);

            // Assert
            Assert.Equal(2, result.Count);

            var firstTicket = result.Find(t => t.ProfileId == 1);
            var secondTicket = result.Find(t => t.ProfileId == 2);

            Assert.Equal(2.0m, firstTicket.Modds);
            Assert.Equal((short)1, firstTicket.OddsType);
            Assert.Equal(200m, firstTicket.ActualPayout);

            Assert.Equal(3.0m, secondTicket.Modds);
            Assert.Equal(1, secondTicket.OddsType);
            Assert.Equal(600m, secondTicket.ActualPayout);

            ticketValueService.Received(2)
                .SetValue(Arg.Any<TicketsBetTransModel>(), Arg.Any<List<WinLimit>>());
        }
    }
}