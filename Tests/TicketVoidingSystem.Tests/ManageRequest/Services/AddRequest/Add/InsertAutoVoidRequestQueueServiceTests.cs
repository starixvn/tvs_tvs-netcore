using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class InsertAutoVoidRequestQueueServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly IDynamicRepository repository;
    private readonly InsertAutoVoidRequestQueueServiceImp service;

    public InsertAutoVoidRequestQueueServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new InsertAutoVoidRequestQueueServiceImp(repository);
    }

    [Theory]
    [InlineData(ActionVoidRequestConstant.AutoVoidAllInstantId)]
    [InlineData(ActionVoidRequestConstant.AutoVoidAllInstantWithOutPolicyId)]
    [InlineData(ActionVoidRequestConstant.AutoVoidAll5mBeforeKickOffId)]
    [InlineData(ActionVoidRequestConstant.AutoVoidAll10mBeforeKickOffId)]
    public void GetData_Successful_CalledExpected(int actionId)
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>()).ReturnsForAnyArgs(1);
        // Act
        _ = service.Execute(4, actionId, null);

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }
}