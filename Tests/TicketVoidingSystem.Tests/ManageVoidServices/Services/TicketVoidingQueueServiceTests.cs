using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageVoidServices.Services;

public class TicketVoidingQueueServiceTests : IClassFixture<RemotingRefFixture>, IClassFixture<AppSettingFixture>
{
    [Fact]
    public async Task GetQueueInAllServers_ExecuteSuccessful_ReturnExpected()
    {
        // Arrange
        var models = new List<TicketVoidingQueueModel> { new() };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<TicketVoidingQueueModel>(Arg.Any<GetTicketVoidingQueueCriteria>())
            .ReturnsForAnyArgs(models);
        var service = new TicketVoidingQueueServiceImp(repository);

        // Act
        var actual = await service.GetQueueInAllServers(1);

        // Assert
        await repository.Received()
            .FetchAsync<TicketVoidingQueueModel>(Arg.Any<GetTicketVoidingQueueCriteria>());
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task UpdateQueueByBatch_ExecuteSuccessful_RepositoryHasCalled()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var service = new TicketVoidingQueueServiceImp(repository);

        // Act
        await service.UpdateQueueByBatch(1, "", 1);

        // Assert
        await repository.Received(1)
            .ExecuteAsync(Arg.Compat.Is<UpdateTicketVoidingQueueByBatchCriteria>(x => x.StatusId == 1));
    }
}