using System.Collections.Generic;
using System.Linq;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Services.ConfirmAutoUnmark;

public class MapDataForConfirmAutoUnmarkServiceTests : IClassFixture<RemotingRefFixture>
{
    [Theory]
    [InlineData("12312")]
    [InlineData("12312a")]
    public void MapToConfirmAutoUnmarkViewModels_ReturnExpected(string betId)
    {
        // Arrange
        var models = new List<ConfirmAutoUnmarkModel>
        {
            new() { BetId = betId, MatchId = 99 }
        };
        var remotingRefService = Substitute.For<RemotingRefWrapperService>();
        var betListService = Substitute.For<BetListService>();

        var service = new MapDataForConfirmAutoUnmarkServiceImp(remotingRefService, betListService);

        // Act
        var actual = service.MapToConfirmAutoUnmarkViewModels(models);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(99, actual.First().MatchId);
    }
}