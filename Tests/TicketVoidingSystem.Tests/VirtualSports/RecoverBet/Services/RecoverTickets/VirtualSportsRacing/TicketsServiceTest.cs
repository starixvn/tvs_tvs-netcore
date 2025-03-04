using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Settlement.Business.Core.Models;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using Xunit;
using SettlementResources = Settlement.Business.Core.Models.Resources;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing
{
    public class TicketsServiceTest
    {
        private readonly IDynamicRepository repository;
        private readonly CalculateService calculateService;
        private readonly SessionService sessionService;
        private readonly TicketsServicesImp ticketsService;

        public TicketsServiceTest()
        {
            // Setup mocks
            repository = Substitute.For<IDynamicRepository>();
            calculateService = Substitute.For<CalculateService>();
            sessionService = Substitute.For<SessionService>();

            // Create service instance
            ticketsService = new TicketsServicesImp(repository, calculateService, sessionService);
        }

        [Fact]
        public async Task GetTicketVs2Racing_WithEmptyTicketsInSiteDb_ReturnsEmptyList()
        {
            // Arrange
            var vs2RacingTickets = new List<BetIdRecover>
            {
                new() { TransId = "101", SiteDbGroupId = 2 }
            };
            var resources = new List<SettlementResources>
            {
                new() { ResourceId = "1", OddsType = 1 }
            };
            const int siteDbGroupId = 1;

            // Act
            var result = await ticketsService.GetTicketVs2Racing(vs2RacingTickets, resources, siteDbGroupId);

            // Assert
            Assert.Empty(result);
            await repository.DidNotReceive().FetchAsync<TicketsBetTransModel>(Arg.Any<GetTicketsVs2RacingCriteria>());
        }

        [Fact]
        public async Task GetTicketVs2Racing_WithTicketsInSiteDb_ReturnsFetchedTickets()
        {
            // Arrange
            var vs2RacingTickets = new List<BetIdRecover>
            {
                new() { TransId = "101", SiteDbGroupId = 1 },
                new() { TransId = "102", SiteDbGroupId = 1 }
            };
            var resources = new List<SettlementResources>
            {
                new() { ResourceId = "1", OddsType = 1 },
                new() { ResourceId = "2", OddsType = 2 }
            };
            const int siteDbGroupId = 1;

            var expectedTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, MatchId = 1001 },
                new() { TransId = 102, MatchId = 1001 }
            };

            repository.FetchAsync<TicketsBetTransModel>(Arg.Any<GetTicketsVs2RacingCriteria>())
                .Returns(expectedTickets);

            // Act
            var result = await ticketsService.GetTicketVs2Racing(vs2RacingTickets, resources, siteDbGroupId);

            // Assert
            Assert.Equal(expectedTickets, result);
            await repository.Received(1).FetchAsync<TicketsBetTransModel>(Arg.Is<GetTicketsVs2RacingCriteria>(
                c => c.Resources == "1,2" &&
                     c.TransIds == "101,102" &&
                     c.SiteDbGroupId == 1));
        }

        [Fact]
        public async Task RecoverTicketVs2Racing_ShouldReturnValidationAndRecoveredTickets()
        {
            // Arrange
            var tickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, MatchId = 1001 }
            };
            const int siteDbGroupId = 1;

            var recoveredTickets = new List<RecoverTicketModel>
            {
                new() { TransId = 101 }
            };

            var criteria = new RecoverTicketsVs2RacingCriteria
            {
                ErrorCode = 0,
                ErrorMsg = "",
                NegativeBalanceUsers = "user1"
            };

            repository.FetchAsync<RecoverTicketModel>(Arg.Any<RecoverTicketsVs2RacingCriteria>())
                .Returns(recoveredTickets)
                .AndDoes(info =>
                {
                    var receivedCriteria = info.Arg<RecoverTicketsVs2RacingCriteria>();
                    receivedCriteria.ErrorCode = criteria.ErrorCode;
                    receivedCriteria.ErrorMsg = criteria.ErrorMsg;
                    receivedCriteria.NegativeBalanceUsers = criteria.NegativeBalanceUsers;
                });

            // Act
            var result = await ticketsService.RecoverTicketVs2Racing(tickets, siteDbGroupId);

            // Assert
            Assert.Equal(0, result.Item1.ErrorCode);
            Assert.Equal("", result.Item1.ErrorMsg);
            Assert.Equal("user1", result.Item1.NegativeBalanceUsers);
            Assert.Equal(recoveredTickets, result.Item2);
            var ticketJson = JsonSerializer.Serialize(tickets);
            await repository.Received(1).FetchAsync<RecoverTicketModel>(Arg.Is<RecoverTicketsVs2RacingCriteria>(c =>
                    c.SiteDbGroupId == 1 && c.TransInfoJson == ticketJson));
        }

        [Fact]
        public async Task PrepareTickets_WithMixedActionTickets_ShouldProcessAllTypes()
        {
            // Arrange
            var originalTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, Action = null },
                new() { TransId = 102, Action = SettlementAction.ReCalculate },
                new() { TransId = 103, Action = SettlementAction.Refund }
            };

            var outright = new List<Outright> { new() };
            var resources = new List<SettlementResources>
            {
                new() { OddsType = 1 }
            };
            var runningTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, Action = null }
            };
            var settledTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 102, Action = SettlementAction.ReCalculate }
            };
            var refundTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 103, Action = SettlementAction.Refund }
            };
            calculateService.ResetToRunning(Arg.Is<List<TicketsBetTransModel>>(list => list.Count == 1 && list[0].Action == null))
                .Returns(runningTickets);
            calculateService.ResetToRunning(Arg.Is<List<TicketsBetTransModel>>(list => list.Count == 1 && list[0].Action == SettlementAction.ReCalculate))
                .Returns(settledTickets);
            calculateService.ResetToRunning(Arg.Is<List<TicketsBetTransModel>>(list => list.Count == 1 && list[0].Action == SettlementAction.Refund))
                .Returns(refundTickets);

            var processedSettleTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 102, Status = "Won" }
            };
            var processedRefundTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 103, Status = "Refund" }
            };

            calculateService.Settle(default, default, default)
                .ReturnsForAnyArgs(processedSettleTickets);
            calculateService.Refund(refundTickets)
                .Returns(processedRefundTickets);

            // Act
            var result = await ticketsService.PrepareTickets(originalTickets, outright, resources);

            // Assert
            Assert.Equal(3, result.Count());
            Assert.Contains(result, t => t is { TransId: 101, Action: null });
            Assert.Contains(result, t => t is { TransId: 102, Status: "Won" });
            Assert.Contains(result, t => t is { TransId: 103, Status: "Refund" });

            calculateService.Received(1).ResetToRunning(Arg.Is<List<TicketsBetTransModel>>(list =>
                    list.Count == 1 && list[0].Action == SettlementAction.ReCalculate));

            calculateService.Received(1).ResetToRunning(Arg.Is<List<TicketsBetTransModel>>(list =>
                    list.Count == 1 && list[0].Action == SettlementAction.Refund));

            calculateService.Received(1).Refund(refundTickets);
        }

        [Fact]
        public async Task PrepareTickets_WithNoActionableTickets_ShouldReturnOriginalRunningTickets()
        {
            // Arrange
            var originalTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, Action = null },
                new() { TransId = 102, Action = null }
            };

            var outright = new List<Outright> { new() };
            var resources = new List<SettlementResources>
            {
                new() { OddsType = 1 }
            };
            calculateService.ResetToRunning(default).ReturnsForAnyArgs(originalTickets);

            // Act
            var result = await ticketsService.PrepareTickets(originalTickets, outright, resources);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, t => t.TransId == 101);
            Assert.Contains(result, t => t.TransId == 102);

            calculateService.Received(1).ResetToRunning(Arg.Any<List<TicketsBetTransModel>>());
            await calculateService.DidNotReceive().Settle(
                Arg.Any<List<TicketsBetTransModel>>(),
                Arg.Any<List<Outright>>(),
                Arg.Any<List<SettlementResources>>());
            calculateService.DidNotReceive().Refund(Arg.Any<List<TicketsBetTransModel>>());
        }
    }
}