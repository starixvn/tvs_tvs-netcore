using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.BetTypes;

public class GetGroupBetTypesTvsHandlerTests
{
    [Fact]
    public async Task Handle_ValidRequest_ReturnsGroupBetTypesViewModel()
    {
        // Arrange
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        var handler = new GetGroupBetTypesTvsHandler(betTypesRepository);

        var request = new GetGroupBetTypesTvsRequest
        {
            MatchId = 1,
            IsGetCancelCashOut = true,
            FromTransDate = DateTime.Now.AddDays(-7),
            ToTransDate = DateTime.Now
        };

        var betTypesHaveTickets = new List<BetTypeModel>
        {
            new() { Id = "1", GroupName = "Group1" },
            new() { Id = "2", GroupName = "Group1" },
            new() { Id = "3", GroupName = "Group2" },
            new() { Id = "4", GroupName = "Group2" },
            new() { Id = "5", GroupName = "Group2" }
        };

        betTypesRepository.GetBetTypesHaveTicketsForTvs(request.MatchId, request.IsGetCancelCashOut, request.FromTransDate, request.ToTransDate)
            .Returns(betTypesHaveTickets);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<GroupBetTypesViewModel>(result);

        var expectedGroupBetTypes = new List<GroupBetTypeModel>
        {
            new()
            {
                GroupName = "Group1",
                BetTypes = new List<BetTypeModel>
                {
                    new() { Id = "1", GroupName = "Group1" },
                    new() { Id = "2", GroupName = "Group1" }
                }
            },
            new()
            {
                GroupName = "Group2",
                BetTypes = new List<BetTypeModel>
                {
                    new() { Id = "3", GroupName = "Group2" },
                    new() { Id = "4", GroupName = "Group2" },
                    new() { Id = "5", GroupName = "Group2" }
                }
            }
        };

        Assert.Equal(expectedGroupBetTypes.Count, result.GroupBetTypes.Count());

        for (var i = 0; i < expectedGroupBetTypes.Count; i++)
        {
            Assert.Equal(expectedGroupBetTypes[i].GroupName, result.GroupBetTypes.ElementAt(i).GroupName);
            Assert.Equal(expectedGroupBetTypes[i].BetTypes.Count(), result.GroupBetTypes.ElementAt(i).BetTypes.Count());

            for (var j = 0; j < expectedGroupBetTypes[i].BetTypes.Count(); j++)
            {
                Assert.Equal(expectedGroupBetTypes[i].BetTypes.ElementAt(j).Id, result.GroupBetTypes.ElementAt(i).BetTypes.ElementAt(j).Id);
                Assert.Equal(expectedGroupBetTypes[i].BetTypes.ElementAt(j).GroupName, result.GroupBetTypes.ElementAt(i).BetTypes.ElementAt(j).GroupName);
            }
        }
    }
}