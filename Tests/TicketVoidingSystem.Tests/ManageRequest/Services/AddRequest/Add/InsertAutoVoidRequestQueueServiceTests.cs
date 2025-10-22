using NSubstitute;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class InsertAutoVoidRequestQueueServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly OnlineServerRepository repository;
    private readonly InsertAutoVoidRequestQueueServiceImp service;

    public InsertAutoVoidRequestQueueServiceTests()
    {
        repository = Substitute.For<OnlineServerRepository>();
        service = new InsertAutoVoidRequestQueueServiceImp(repository);
    }

    [Theory]
    [InlineData(ActionVoidRequestConstant.AutoVoidAllInstantId)]
    [InlineData(ActionVoidRequestConstant.AutoVoidAllInstantWithOutPolicyId)]
    public void GetData_Successful_CalledExpected(int actionId)
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>()).ReturnsForAnyArgs([1]);

        // Act
        _ = service.Execute(4, actionId, []);

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }

    [Fact]
    public void GetData_HasEarlyKickOffViewModel_CalledExpected()
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>()).ReturnsForAnyArgs([1]);

        // Act
        _ = service.Execute(4, ActionVoidRequestConstant.AutoVoidAllInstantId, []);

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }

    [Fact]
    public void GetData_HasWrongOfferedNameViewModel_CalledExpected()
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>()).ReturnsForAnyArgs([1]);

        // Act
        _ = service.Execute(4, ActionVoidRequestConstant.AutoVoidAllInstantId, []);

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }

    [Theory]
    [InlineData(FilterByConstant.MixParlay)]
    [InlineData(FilterByConstant.SystemParlay)]
    public void Execute_AbnormalBetIsParlay_CalledExpected(int filterBy)
    {
        // Arrange
        const int actionId = ActionVoidRequestConstant.AutoVoidAllInstantId;
        const int requestId = 123;

        // Act
        _ = service.Execute(requestId, actionId, []);

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }

    [Fact]
    public void Execute_AbnormalBetHasMultipleMatches_CalledExpected()
    {
        // Arrange
        const int actionId = ActionVoidRequestConstant.AutoVoidAllInstantId;
        const int requestId = 123;

        // Act
        _ = service.Execute(requestId, actionId, []);

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }
}