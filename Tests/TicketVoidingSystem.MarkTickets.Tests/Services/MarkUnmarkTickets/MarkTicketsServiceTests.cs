using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.MarkUnmarkTickets;

public class MarkTicketsServiceTests
{
    [Theory]
    [InlineData(0, 0)]
    [InlineData(1, 1)]
    public async Task Execute_RepositoryHasCalled(byte statusId, int errorCode)
    {
        // Arrange
        var query = new MarkTicketsQuery()
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
        repository.FetchAsync<Result>(default).ReturnsForAnyArgs(new List<Result> { new() { ErrorCode = errorCode } });
        var service = new MarkTicketsServiceImp(repository, sessionService);

        // Act
        var actual = await service.Execute(query);

        // Assert
        await repository.Received().FetchAsync<Result>(Arg.Any<MarkTicketsCommand>());
        Assert.NotNull(actual);
    }
}