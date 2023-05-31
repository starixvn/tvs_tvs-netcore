using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Services;

public class AfterVoidServiceTests
{
    [Fact]
    public async Task UpdateVoidBetAutomationServiceInfo_StatusIsNull_RepositoryHasExecuted()
    {
        // Arrange
        var model = new VoidBetAutomationModel
        {
            StatusId = null
        };
        var repository = Substitute.For<IDynamicRepository>();
        var service = new AfterVoidServiceImp(repository);

        // Act
        await service.UpdateVoidBetAutomationServiceInfo(model);

        // Assert
        await repository.Received(1)
            .ExecuteAsync(Arg.Compat.Is<UpdateVoidBetAutomationInfoCriteria>(x => x.RequestId == model.RequestId));
    }

    [Fact]
    public async Task UpdateVoidBetAutomationServiceInfo_StatusIsNotNull_RepositoryHasExecuted()
    {
        // Arrange
        var model = new VoidBetAutomationModel
        {
            StatusId = 1
        };
        var repository = Substitute.For<IDynamicRepository>();
        var service = new AfterVoidServiceImp(repository);

        // Act
        await service.UpdateVoidBetAutomationServiceInfo(model);

        // Assert
        await repository.Received(1)
            .ExecuteAsync(Arg.Compat.Is<UpdateVoidBetAutomationInfoCriteria>(x => x.RequestId == model.RequestId));
    }

    // Jacob xem lại test case name
    [Fact]
    public async Task GetVoidBetAutomationServiceInfo_ExecuteSuccessful_ReturnExpected()
    {
        // Arrange
        var criteria = new GetVoidBetAutomationInfoCriteria();
        criteria.GetSettingKey();
        criteria.IsValid();
        var expected = new VoidBetAutomationModel();
        var repository = Substitute.For<IDynamicRepository>();
        repository.GetAsync<VoidBetAutomationModel>(criteria).ReturnsForAnyArgs(expected);
        var service = new AfterVoidServiceImp(repository);

        // Act
        var actual = await service.GetVoidBetAutomationServiceInfo(expected);

        // Assert
        await repository.Received(1)
            .GetAsync<VoidBetAutomationModel>(
                Arg.Compat.Is<GetVoidBetAutomationInfoCriteria>(x => x.RequestId == expected.RequestId));
        Assert.Equal(expected, actual);
    }
}