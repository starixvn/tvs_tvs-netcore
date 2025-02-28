using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using Settlement.Business.Core.Models;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using Xunit;
using Result = TicketVoidingSystem.Models.Result;
using SettlementResources = Settlement.Business.Core.Models.Resources;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing
{
    public class RecoverRacingServiceTest
    {
        private readonly TicketsService ticketsService;
        private readonly Repository repository;
        private readonly MatchService matchService;
        private readonly IMapper mapper;
        private readonly RecoverRacingServiceImp recoverRacingService;

        public RecoverRacingServiceTest()
        {
            ticketsService = Substitute.For<TicketsService>();
            repository = Substitute.For<Repository>();
            matchService = Substitute.For<MatchService>();
            mapper = Substitute.For<IMapper>();
            recoverRacingService = new RecoverRacingServiceImp(
                ticketsService,
                repository,
                matchService,
                mapper);
        }

        [Fact]
        public async Task Execute_WithMultipleGroups_ShouldReturnArrayOfResults()
        {
            // Arrange
            var betIds = new List<BetIdRecover>
            {
                new() { TransId = "101", MatchId = 1, SiteDbGroupId = 1 },
                new() { TransId = "102", MatchId = 1, SiteDbGroupId = 1 },
                new() { TransId = "201", MatchId = 2, SiteDbGroupId = 1 }
            };

            // Set up mocks for each group processing
            var outright1 = new List<Outright> { new() { Orid = 1 } };
            var resources1 = new List<SettlementResources> { new() { ProfileId = 1, OddsType = 1 } };
            repository.GetRacingInfo(1).Returns((outright1, resources1));

            var outright2 = new List<Outright> { new() { Orid = 2 } };
            var resources2 = new List<SettlementResources> { new() { ProfileId = 2, OddsType = 2 } };
            repository.GetRacingInfo(2).Returns((outright2, resources2));

            var ticketsGroup1 = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, MatchId = 1 }
            };
            ticketsService.GetTicketVs2Racing(Arg.Is<IGrouping<KeyGroupTicket, BetIdRecover>>(g => g.Key.MatchId == 1),
                resources1, 1).Returns(ticketsGroup1);

            var ticketsGroup2 = new List<TicketsBetTransModel>
            {
                new() { TransId = 201, MatchId = 2 }
            };
            ticketsService.GetTicketVs2Racing(Arg.Is<IGrouping<KeyGroupTicket, BetIdRecover>>(g => g.Key.MatchId == 2),
                resources2, 1).Returns(ticketsGroup2);

            var preparedTickets1 = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, MatchId = 1, OddsType = (short)1 }
            };
            ticketsService.PrepareTickets(ticketsGroup1, outright1, resources1).Returns(preparedTickets1);

            var preparedTickets2 = new List<TicketsBetTransModel>
            {
                new() { TransId = 201, MatchId = 2, OddsType = (short)2 }
            };
            ticketsService.PrepareTickets(ticketsGroup2, outright2, resources2).Returns(preparedTickets2);

            var lockResult1 = new Result();
            matchService.LockMatch(1, LockMatchType.VirtualRacing, LockMatchStatus.Lock, 1).Returns(lockResult1);

            var lockResult2 = new Result();
            matchService.LockMatch(2, LockMatchType.VirtualRacing, LockMatchStatus.Lock, 1).Returns(lockResult2);

            var validation1 = new RecoverTicketsValidation();
            mapper.Map<RecoverTicketsValidation>(lockResult1).Returns(validation1);

            var validation2 = new RecoverTicketsValidation();
            mapper.Map<RecoverTicketsValidation>(lockResult2).Returns(validation2);

            var recoveredTickets1 = new List<RecoverTicketModel>
            {
                new() { TransId = 101, CurrencyCode = "USD" }
            };

            var recoverValidation1 = new RecoverTicketsValidation
            {
                ErrorCode = 0,
                ErrorMsg = string.Empty,
                NegativeBalanceUsers = "user1"
            };

            ticketsService.RecoverTicketVs2Racing(preparedTickets1, 1)
                .Returns((recoverValidation1, recoveredTickets1));

            var recoveredTickets2 = new List<RecoverTicketModel>
            {
                new() { TransId = 201, CurrencyCode = "EUR" }
            };

            var recoverValidation2 = new RecoverTicketsValidation
            {
                ErrorCode = 0,
                ErrorMsg = string.Empty,
                NegativeBalanceUsers = "user2"
            };

            ticketsService.RecoverTicketVs2Racing(preparedTickets2, 1)
                .Returns((recoverValidation2, recoveredTickets2));

            // Act
            var results = await recoverRacingService.Execute(betIds);

            // Assert
            Assert.Equal(2, results.Length);

            // First group result
            var group1Result = results.First(r => r.Item2.Any(t => t.TransId == 101));
            Assert.Single(group1Result.Item1);
            Assert.Equal(0, group1Result.Item1.First().ErrorCode);
            Assert.Equal("user1", group1Result.Item1.First().NegativeBalanceUsers);
            Assert.Single(group1Result.Item2);
            Assert.Equal(101, group1Result.Item2.First().TransId);
            Assert.Equal("USD", group1Result.Item2.First().CurrencyCode);

            // Second group result
            var group2Result = results.First(r => r.Item2.Any(t => t.TransId == 201));
            Assert.Single(group2Result.Item1);
            Assert.Equal(0, group2Result.Item1.First().ErrorCode);
            Assert.Equal("user2", group2Result.Item1.First().NegativeBalanceUsers);
            Assert.Single(group2Result.Item2);
            Assert.Equal(201, group2Result.Item2.First().TransId);
            Assert.Equal("EUR", group2Result.Item2.First().CurrencyCode);

            // Verify unlocking
            await matchService.Received(1).LockMatch(1, LockMatchType.VirtualRacing, LockMatchStatus.UnLock, 1);
            await matchService.Received(1).LockMatch(2, LockMatchType.VirtualRacing, LockMatchStatus.UnLock, 1);
        }

        [Fact]
        public async Task Execute_WhenLockMatchFails_ShouldReturnValidationError()
        {
            // Arrange
            var betIds = new List<BetIdRecover>
            {
                new() { TransId = "101", MatchId = 1, SiteDbGroupId = 1 }
            };

            var outright = new List<Outright> { new() { Orid = 1 } };
            var resources = new List<SettlementResources> { new() { ProfileId = 1, OddsType = 1 } };
            repository.GetRacingInfo(1).Returns((outright, resources));

            var tickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, MatchId = 1 }
            };
            ticketsService.GetTicketVs2Racing(Arg.Any<IGrouping<KeyGroupTicket, BetIdRecover>>(), resources, 1)
                .Returns(tickets);

            var preparedTickets = new List<TicketsBetTransModel>
            {
                new() { TransId = 101, MatchId = 1 }
            };
            ticketsService.PrepareTickets(tickets, outright, resources).Returns(preparedTickets);

            var lockResult = new Result { ErrorCode = 5, ErrorMsg = "Match already locked" };
            matchService.LockMatch(1, LockMatchType.VirtualRacing, LockMatchStatus.Lock, 1).Returns(lockResult);

            var validation = new RecoverTicketsValidation
            {
                ErrorCode = 5,
                ErrorMsg = "Match already locked"
            };
            mapper.Map<RecoverTicketsValidation>(lockResult).Returns(validation);

            // Act
            var results = await recoverRacingService.Execute(betIds);

            // Assert
            Assert.Single(results);
            Assert.Single(results[0].Item1);
            Assert.Equal(5, results[0].Item1.First().ErrorCode);
            Assert.Equal("Match already locked", results[0].Item1.First().ErrorMsg);
            Assert.False(results[0].Item1.First().IsSuccessful);
            Assert.Empty(results[0].Item2);

            // Verify no recovery was attempted and no unlock needed
            await ticketsService.DidNotReceive()
                .RecoverTicketVs2Racing(Arg.Any<IEnumerable<TicketsBetTransModel>>(), Arg.Any<int>());
            await matchService.DidNotReceive().LockMatch(1, LockMatchType.VirtualRacing, LockMatchStatus.UnLock, 1);
        }

        [Fact]
        public async Task Execute_WhenExceptionThrown_ShouldHandleErrorAndUnlockMatch()
        {
            // Arrange
            var betIds = new List<BetIdRecover>
            {
                new() { TransId = "101", MatchId = 1, SiteDbGroupId = 1 }
            };

            repository.GetRacingInfo(1)
                .Returns<(IEnumerable<Outright>, IEnumerable<SettlementResources>)>(
                    _ => throw new Exception("Database connection failed"));

            // Act
            var results = await recoverRacingService.Execute(betIds);

            // Assert
            Assert.Single(results);
            Assert.Single(results[0].Item1);
            Assert.Equal(1, results[0].Item1.First().ErrorCode);
            Assert.Contains("MatchId = 1 - SiteDbGroupId = 1 - Database connection failed",
                results[0].Item1.First().ErrorMsg);
            Assert.Empty(results[0].Item2);

            // Verify unlock was called
            await matchService.Received(1).LockMatch(1, LockMatchType.VirtualRacing, LockMatchStatus.UnLock, 1);
        }
    }
}