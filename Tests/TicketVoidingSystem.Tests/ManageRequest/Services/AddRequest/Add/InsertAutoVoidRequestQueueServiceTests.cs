using System.Collections.Generic;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.ViewModels;
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
    public void GetData_Successful_CalledExpected(int actionId)
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>()).ReturnsForAnyArgs(1);

        // Act
        _ = service.Execute(4, actionId, new List<int>());

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }

    [Fact]
    public void GetData_HasEarlyKickOffViewModel_CalledExpected()
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>()).ReturnsForAnyArgs(1);
        var earlyKickOffInfo = new List<EarlyKickOffViewModel> { new() { MatchId = 1 } };

        // Act
        _ = service.Execute(4, ActionVoidRequestConstant.AutoVoidAllInstantId, new List<int>());

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }

    [Fact]
    public void GetData_HasWrongOfferedNameViewModel_CalledExpected()
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>()).ReturnsForAnyArgs(1);
        var wrongOfferedName = new WrongOfferedNameViewModel { MatchId = 1 };

        // Act
        _ = service.Execute(4, ActionVoidRequestConstant.AutoVoidAllInstantId, new List<int>());

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
        var abnormalBetInfo = new AbnormalBetViewModel { FilterBy = filterBy };

        // Act
        _ = service.Execute(requestId, actionId, new List<int>());

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }

    [Fact]
    public void Execute_AbnormalBetHasMultipleMatches_CalledExpected()
    {
        // Arrange
        const int actionId = ActionVoidRequestConstant.AutoVoidAllInstantId;
        const int requestId = 123;
        var abnormalBetInfo = new AbnormalBetViewModel { Matches = new List<MatchInfoAddRequest> { new() { MatchId = 1 } } };

        // Act
        _ = service.Execute(requestId, actionId, new List<int>());

        // Assert
        repository.Received().ExecuteAsync(Arg.Any<InsertAutoVoidRequestQueueCommand>());
    }
}