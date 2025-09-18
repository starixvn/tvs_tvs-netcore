using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Settlement.Business.Services;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing
{
    public class TicketsServiceTest
    {
        private readonly IDynamicRepository repository;
        private readonly TicketsServicesImp ticketsService;

        public TicketsServiceTest()
        {
            // Setup mocks
            repository = Substitute.For<IDynamicRepository>();
            var ticketValueService1 = Substitute.For<TicketValueService>();
            var winLimitService1 = Substitute.For<WinLimitService>();
            var sessionService = Substitute.For<SessionService>();
            var historyDataService = Substitute.For<HistoryDataService>();

            // Create service instance
            ticketsService = new TicketsServicesImp(repository, ticketValueService1, winLimitService1, sessionService, historyDataService);
        }

        [Fact]
        public async Task GetTicketVs2Racing_WithEmptyTicketsInSiteDb_ReturnsEmptyList()
        {
            // Arrange
            var vs2RacingTickets = new List<BetIdRecover>
            {
                new() { TransId = "101", SiteDbGroupId = 2 }
            };
            const int siteDbGroupId = 1;

            // Act
            var result = await ticketsService.GetTicketVs2Racing(vs2RacingTickets, siteDbGroupId);

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
            const int siteDbGroupId = 1;

            var expectedTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, MatchId = 1001 },
                new() { TransId = 102, MatchId = 1001 }
            };

            repository.FetchAsync<TicketsBetTransModel>(Arg.Any<GetTicketsVs2RacingCriteria>())
                .Returns(expectedTickets);

            // Act
            var result = await ticketsService.GetTicketVs2Racing(vs2RacingTickets, siteDbGroupId);

            // Assert
            Assert.Equal(expectedTickets, result);
            await repository.Received(1).FetchAsync<TicketsBetTransModel>(Arg.Is<GetTicketsVs2RacingCriteria>(
                c => c.TransIds == "101,102" &&
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
    }
}