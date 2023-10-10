using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Services.MarkUnmarkTickets;

public class MarkTicketsServiceTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
{
    [Theory]
    [InlineData(0, 0, "errorMsg")]
    [InlineData(1, 1, "errorMsg")]
    [InlineData(1, 0, null)]
    public async Task Execute_RepositoryHasCalled(byte statusId, int errorCode, string errorMsg)
    {
        // Arrange
        var query = new MarkTicketsQuery
        {
            Status = statusId,
            Tickets = new List<BetId>
            {
                new() { SiteDbGroupId = 1 },
                new() { SiteDbGroupId = 2 }
            }
        };
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        repository.FetchAsync<Result>(default).ReturnsForAnyArgs(new List<Result> { new() { ErrorCode = errorCode, ErrorMsg = errorMsg } });
        var service = new MarkTicketsServiceImp(repository, sessionService);

        // Act
        var actual = await service.Execute(query);

        // Assert
        await repository.Received().FetchAsync<Result>(Arg.Any<MarkTicketsCommand>());
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task Execute_RepositoryReturnEmpty_HasNoErrorResult()
    {
        // Arrange
        var query = new MarkTicketsQuery
        {
            Status = 1,
            Tickets = new List<BetId>
            {
                new() { SiteDbGroupId = 1 },
                new() { SiteDbGroupId = 2 }
            }
        };
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        repository.FetchAsync<Result>(default).ReturnsForAnyArgs(new List<Result> ());
        var service = new MarkTicketsServiceImp(repository, sessionService);
        var expected = new Result
        {
            ErrorCode = 0,
            ErrorMsg = string.Empty
        };

        // Act
        var actual = await service.Execute(query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}