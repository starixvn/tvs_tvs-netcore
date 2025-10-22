using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Services.MarkUnmarkTickets;

public class MarkAllTicketsServiceTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
{
    [Fact]
    public async Task Execute_WithPermission_MarkDoneAllServer_ReturnSuccessful()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        repository.FetchAsync<Result>(null).ReturnsForAnyArgs(new List<Result> { new() });
        var service = new MarkAllTicketsServiceImp(repository, sessionService);

        // Act
        var actual = await service.Execute(new MarkAllTicketsQuery());

        // Assert
        Assert.True(actual.IsSuccessful);
    }

    [Fact]
    public async Task Execute_WithPermission_MarkFail_ReturnSuccessful()
    {
        // Arrange
        var failedResult = new Result { ErrorCode = 1, ErrorMsg = "Fail" };
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        repository.FetchAsync<Result>(null).ReturnsForAnyArgs(new List<Result> { failedResult });
        var service = new MarkAllTicketsServiceImp(repository, sessionService);

        // Act
        var actual = await service.Execute(new MarkAllTicketsQuery());

        // Assert
        Assert.False(actual.IsSuccessful);
        Assert.Equal(failedResult.ErrorMsg, actual.ErrorMsg);
    }
}