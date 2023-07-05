using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using FizzWare.NBuilder;
using NSubstitute;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Services;

public class GetSummaryTicketsServiceTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    public async Task GetSummaryTickets_ReturnViewModel(int licenseeId)
    {
        // Arrange
        var summaryTicketModels = new List<SummaryTicketModel>
        {
            new() {LicenseeName = "AA", TotalTrans = 1, BetTypeId = 1, BetTypeName = "1"},
            new() {LicenseeName = "AA", TotalTrans = 2, BetTypeId = 1, BetTypeName = "1"},
            new() {LicenseeName = "AA", TotalTrans = 1, BetTypeId = 1, BetTypeName = "1"},
            new() {LicenseeName = "BB", TotalTrans = 2, BetTypeId = 1, BetTypeName = "1"}
        };
        var query = Builder<GetSummaryQuery>.CreateNew().With(x => x.LicenseeId = licenseeId).Build();
        var repository = Substitute.For<IDynamicRepository>();
        var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
        var betListService = Substitute.For<BetListService>();
        betListService.GetBetTypeName(default, default).Returns("HHH");
        repository.FetchAsync<SummaryTicketModel>(default).ReturnsForAnyArgs(summaryTicketModels);
        var service = new GetSummaryTicketsServiceImp(TestSetup.CreateMapper(), repository, affectTicketsFromSettlementHistoryService, betListService);

        // Act
        var actual = await service.GetSummaryTickets(query);

        // Assert
        await affectTicketsFromSettlementHistoryService.Received(1).GetTickets(Arg.Any<bool>(), Arg.Any<int>());
        Assert.NotNull(actual.GroupByBetTypes);
        Assert.NotNull(actual.GroupByLicensees);
    }

    [Fact]
    public async Task GetSummaryTickets_HaveNotAny_ReturnNewViewModel()
    {
        // Arrange
        var query = Builder<GetSummaryQuery>.CreateNew().Build();
        var repository = Substitute.For<IDynamicRepository>();
        var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
        var betListService = Substitute.For<BetListService>();
        betListService.GetBetTypeName(default, default).ReturnsForAnyArgs("HHH");
        repository.FetchAsync<SummaryTicketModel>(default).ReturnsForAnyArgs((List<SummaryTicketModel>)null);
        var service = new GetSummaryTicketsServiceImp(TestSetup.CreateMapper(), repository, affectTicketsFromSettlementHistoryService, betListService);

        // Act
        var actual = await service.GetSummaryTickets(query);

        // Assert
        await affectTicketsFromSettlementHistoryService.Received(1).GetTickets(Arg.Any<bool>(), Arg.Any<int>());
        Assert.Empty(actual.GroupByBetTypes);
        Assert.Empty(actual.GroupByLicensees);
    }
}