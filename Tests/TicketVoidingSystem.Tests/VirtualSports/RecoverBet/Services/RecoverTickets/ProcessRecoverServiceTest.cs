using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NSubstitute;
using Settlement.Business.Core.Constants;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets
{
    public class ProcessRecoverServiceTest
    {
        private readonly Repository repository;
        private readonly RecoverRacingService recoverRacingService;
        private readonly ProcessRecoverServiceImp processRecoverService;

        public ProcessRecoverServiceTest()
        {
            repository = Substitute.For<Repository>();
            recoverRacingService = Substitute.For<RecoverRacingService>();
            processRecoverService = new ProcessRecoverServiceImp(repository, recoverRacingService);
        }

        [Fact]
        public async Task Execute_WithRacingAndNonRacingTickets_ShouldReturnCombinedResults()
        {
            // Arrange
            var query = new Query
            {
                Tickets = new List<BetIdRecover>
                {
                    new() { TransId = "101", SportType = SportType.VirtualDogs },
                    new() { TransId = "102", SportType = SportType.Happy5 }
                }
            };

            var racingResults = new[]
            {
                (
                    new[] { new RecoverTicketsValidation() }.AsEnumerable(),
                    new[] { new RecoverTicketModel { TransId = 101 } }.AsEnumerable()
                )
            };

            var nonRacingResults = new[]
            {
                (
                    new[] { new RecoverTicketsValidation() }.AsEnumerable(),
                    new[] { new RecoverTicketModel { TransId = 102 } }.AsEnumerable()
                )
            };

            recoverRacingService.Execute(null).ReturnsForAnyArgs(racingResults);
            repository.RecoverNotRacingSports(null, null).ReturnsForAnyArgs(nonRacingResults);

            // Act
            var result = await processRecoverService.Execute(query);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Tickets.Count());
            Assert.Contains(result.Tickets, t => t.TransId == 101);
            Assert.Contains(result.Tickets, t => t.TransId == 102);
        }

        [Fact]
        public async Task Execute_WithOnlyRacingTickets_ShouldReturnRacingResults()
        {
            // Arrange
            var query = new Query
            {
                Tickets = new List<BetIdRecover>
                {
                    new() { TransId = "101", SportType = SportType.VirtualDogs }
                }
            };
            var racingResults = new[]
            {
                (
                    new[] { new RecoverTicketsValidation() }.AsEnumerable(),
                    new[] { new RecoverTicketModel { TransId = 101 } }.AsEnumerable()
                )
            };

            recoverRacingService.Execute(null).ReturnsForAnyArgs(racingResults);

            // Act
            var result = await processRecoverService.Execute(query);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Tickets);
            Assert.Contains(result.Tickets, t => t.TransId == 101);
        }

        [Fact]
        public async Task Execute_WithOnlyNonRacingTickets_ShouldReturnNonRacingResults()
        {
            // Arrange
            var query = new Query
            {
                Tickets = new List<BetIdRecover>
                {
                    new() { TransId = "102", SportType = SportType.Happy5 }
                }
            };

            var nonRacingResults = new[]
            {
                (
                    new[] { new RecoverTicketsValidation() }.AsEnumerable(),
                    new[] { new RecoverTicketModel { TransId = 102 } }.AsEnumerable()
                )
            };

            repository.RecoverNotRacingSports(null, null).ReturnsForAnyArgs(nonRacingResults);

            // Act
            var result = await processRecoverService.Execute(query);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Tickets);
            Assert.Contains(result.Tickets, t => t.TransId == 102);
        }

        [Fact]
        public async Task Execute_WithFailedValidation_ShouldReturnFailedResult()
        {
            // Arrange
            var query = new Query
            {
                Tickets = new List<BetIdRecover>
                {
                    new() { TransId = "101", SportType = SportType.VirtualDogs }
                }
            };

            var racingResults = new[]
            {
                (
                    new[] { new RecoverTicketsValidation { ErrorCode = 1, ErrorMsg = "Error" } }.AsEnumerable(),
                    Enumerable.Empty<RecoverTicketModel>()
                )
            };

            recoverRacingService.Execute(null).ReturnsForAnyArgs(racingResults);

            // Act
            var result = await processRecoverService.Execute(query);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result.Tickets);
            Assert.Equal(1, result.Validation.ErrorCode);
            Assert.Equal("Error", result.Validation.ErrorMsg);
        }
    }
}