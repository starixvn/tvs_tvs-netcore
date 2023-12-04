using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageVoidServices.Services;

public class LetstalkServiceTests
{
    [Fact]
    public async Task GetLetstalkModel_ExecuteSuccessful_ReturnExpected()
    {
        // Arrange
        var requestId = 1;
        var broadcastSessionId = "1";
        var model = new LetstalkModel();
        var models = new List<LetstalkModel> { model };
        var criteria = new GetLetstalkCriteria();
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<LetstalkModel>(criteria)
            .ReturnsForAnyArgs(models);
        var service = new LetstalkServiceImp(repository);

        // Act
        var actual = await service.GetLetstalkModel(requestId, broadcastSessionId);

        // Assert
        await repository.Received()
            .FetchAsync<LetstalkModel>(Arg.Any<GetLetstalkCriteria>());
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task UpdateLetstalk_ExecuteSuccessful_RepositoryHasCalled()
    {
        // Arrange
        var requestId = 1;
        var broadcastSessionId = "1";
        var statusId = 1;
        var repository = Substitute.For<IDynamicRepository>();
        var service = new LetstalkServiceImp(repository);

        // Act
        await service.UpdateLetstalk(requestId, broadcastSessionId, statusId);

        // Assert
        await repository.Received(1)
            .ExecuteAsync(Arg.Compat.Is<UpdateLetstalkCriteria>(x => x.StatusId == statusId));
    }
}