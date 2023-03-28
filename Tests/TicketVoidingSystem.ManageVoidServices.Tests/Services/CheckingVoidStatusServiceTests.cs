using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Services;

public class CheckingVoidStatusServiceTests
{
    [Fact]
    public async Task GetVoidServiceData_ExecuteSuccessful_ReturnExpected()
    {
        // Arrange
        var model = new VoidServiceModel();
        var models = new List<VoidServiceModel> { model };
        var criteria = new GetVoidServiceDataCriteria();
        criteria.GetSettingKey();
        criteria.IsValid();
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<VoidServiceModel>(criteria)
            .ReturnsForAnyArgs(models);
        var service = new CheckingVoidStatusServiceImp(repository);

        // Act
        var actual = await service.GetVoidServiceData("", 1);

        // Assert
        await repository.Received()
            .FetchAsync<VoidServiceModel>(Arg.Any<GetVoidServiceDataCriteria>());
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task UpdateVoidService_ExecuteSuccessful_RepositoryHasCalled()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var service = new CheckingVoidStatusServiceImp(repository);

        // Act
        await service.UpdateVoidService(1, 1, 1, 1);

        // Assert
        await repository.Received(1)
            .ExecuteAsync(Arg.Compat.Is<UpdateVoidServiceCriteria>(x => x.StatusId == 1));
    }
}