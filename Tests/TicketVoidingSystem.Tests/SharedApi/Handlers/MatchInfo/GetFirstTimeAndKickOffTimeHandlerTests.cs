using System;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.SharedApi.Criteria.MatchInfo;
using TicketVoidingSystem.SharedApi.Handlers.MatchInfo;
using TicketVoidingSystem.SharedApi.Models.MatchInfo;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.MatchInfo;

public class GetFirstTimeAndKickOffTimeHandlerTests
{
    private readonly IDynamicRepository repository;
    private readonly GetFirstTimeAndKickOffTimeHandler handler;
    private readonly GetFirstTimeAndKickOffTimeRequest request;
    private readonly FirstTicketTime ticketTime;

    public GetFirstTimeAndKickOffTimeHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new GetFirstTimeAndKickOffTimeHandler(repository);
        request = new GetFirstTimeAndKickOffTimeRequest { MatchId = 123 };
    }

    [Fact]
    public async Task Handle_HasRequest_HasCreateGetOddsInfoCriteria()
    {
        // Arrange
        var ticketTime = new FirstTicketTime { MinTransDate = DateTime.UtcNow, KickOffTime = DateTime.UtcNow };
        repository.GetAsync<FirstTicketTime>(Arg.Any<GetFirstTicketTimeCriteria>(), Arg.Any<CancellationToken>())
            .ReturnsForAnyArgs(ticketTime);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(ticketTime.MinTransDate.ZoneManila(), result.MinTransDate);
        Assert.Equal(ticketTime.KickOffTime.ZoneManila(), result.KickOffTime);
    }


    [Fact]
    public async Task Handle_Returns_FirstTicketTime_With_Year_Prefix()
    {
        // Arrange
        var ticketTime = new FirstTicketTime { MinTransDate = default, KickOffTime = DateTime.UtcNow };
        var expectMinTransDate = new DateTime(ticketTime.MinTransDate.Year + 2000, ticketTime.MinTransDate.Month, ticketTime.MinTransDate.Day).ZoneManila();
        repository.GetAsync<FirstTicketTime>(Arg.Any<GetFirstTicketTimeCriteria>(), Arg.Any<CancellationToken>())
            .ReturnsForAnyArgs(ticketTime);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectMinTransDate, result.MinTransDate);
        Assert.Equal(ticketTime.KickOffTime.ZoneManila(), result.KickOffTime);
    }
}