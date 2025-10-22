using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Extensions;
using TicketVoidingSystem.TicketListing.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Services;

public class AffectTicketsFromSettlementHistoryServiceTests
{
    [Fact]
    public async Task GetTickets_ReturnListBetId()
    {
        // Arrange
        var expected = new List<BetId>();
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<BetId>(null).ReturnsForAnyArgs(expected);
        var service = new AffectTicketsFromSettlementHistoryServiceImp(repository);

        // Act
        var actual = await service.GetTickets(true, 1);

        // Assert
        await repository.Received(1).FetchAsync<BetId>(Arg.Any<GetSettlementHistoryCriteria>());
        Assert.Equal(expected.ToAffectTicketsXml(), actual);
    }

    [Fact]
    public async Task GetTickets_ReturnEmpty()
    {
        // Arrange
        var service = new AffectTicketsFromSettlementHistoryServiceImp(null!);

        // Act
        var actual = await service.GetTickets(false, 1);

        // Assert
        Assert.Empty(actual);
    }
}