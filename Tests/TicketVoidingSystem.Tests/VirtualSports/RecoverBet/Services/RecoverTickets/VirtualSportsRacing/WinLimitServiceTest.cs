using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Settlement.Business.Core.Models;
using Settlement.Business.Services;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing
{
    public class WinLimitServiceTest
    {
        private readonly CustomerService customerService;
        private readonly IDynamicRepository repository;
        private readonly WinLimitServiceImp winLimitService;

        public WinLimitServiceTest()
        {
            customerService = Substitute.For<CustomerService>();
            repository = Substitute.For<IDynamicRepository>();
            winLimitService = new WinLimitServiceImp(customerService, repository);
        }

        [Fact]
        public async Task GetMaxWinLimit_WithEmptyTickets_ReturnsEmptyList()
        {
            // Arrange
            var tickets = new List<TicketsBetTransModel>();

            // Act
            var result = await winLimitService.GetMaxWinLimit(tickets);

            // Assert
            Assert.Empty(result);
            await repository.DidNotReceive().FetchAsync<WinLimit>(Arg.Any<GetMaxPayoutSettingCriteria>());
        }

        [Fact]
        public async Task GetMaxWinLimit_WithNonSiteDb3Tickets_ReturnsEmptyList()
        {
            var tickets = new List<TicketsBetTransModel>
            {
                new() { SiteDBGroupId = 1 }
            };

            // Act
            var result = await winLimitService.GetMaxWinLimit(tickets);

            // Assert
            Assert.Empty(result);
            await repository.DidNotReceive().FetchAsync<WinLimit>(Arg.Any<GetMaxPayoutSettingCriteria>());
        }

        [Fact]
        public async Task GetMaxWinLimit_WithValidTickets_ReturnsWinLimits()
        {
            // Arrange
            var tickets = new List<TicketsBetTransModel>
            {
                new() { SiteDBGroupId = 3, Modds = 2.0m }
            };

            var customerIds = new List<Customer> { new() { CustId = 1 }, new() { CustId = 2 }, new() { CustId = 3 } };
            customerService.GetCustomersByModds(tickets).Returns(customerIds);

            var winLimits = new List<WinLimit>
            {
                new() { CustId = 1, MaxWinLimit = 1000 },
                new() { CustId = 2, MaxWinLimit = 2000 }
            };

            // Act
            repository.FetchAsync<WinLimit>(Arg.Any<GetMaxPayoutSettingCriteria>())
                .Returns(winLimits);

            // Assert
            var result = await winLimitService.GetMaxWinLimit(tickets);
            var customersJson = JsonSerializer.Serialize(customerIds);

            Assert.Equal(winLimits, result);
            await repository.Received(1).FetchAsync<WinLimit>(Arg.Is<GetMaxPayoutSettingCriteria>(
                c => c.ListCust == customersJson));
        }
    }
}