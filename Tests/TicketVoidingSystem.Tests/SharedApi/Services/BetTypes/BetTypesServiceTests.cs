using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.BetTypes;

public class BetTypesServiceTests
{
    private readonly BetTypesRepository repository;
    private readonly BetTypesServiceImp service;

    public BetTypesServiceTests()
    {
        repository = Substitute.For<BetTypesRepository>();
        service = new BetTypesServiceImp(repository);
    }

    [Fact]
    public async Task GetBetTypes_Return_ExpectedValue()
    {
        // Arrange
        var criteria = new GetBetTypesCriteria();
        var expected = new BetTypesViewModel();

        repository.GetBetTypes(criteria).ReturnsForAnyArgs(expected);

        // Act
        var result = service.GetBetTypes(criteria);

        // Assert
        Assert.NotNull(result);
        await repository.Received().GetBetTypes(criteria);
    }

    [Fact]
    public async Task GetGroupBetTypes_BetTypesIsEmpty_ExpectedValue()
    {
        // Arrange
        var query = new BetTypeQueryModel { MatchId = 1, BetTypes = "" };
        var betTypes = new BetTypesViewModel { BetTypes = new List<BetTypeModel> { new() } };
        var expectedResult = new GroupBetTypesViewModel
        {
            GroupBetTypes = new List<GroupBetTypeModel> { new() { BetTypes = new List<BetTypeModel> { new() } } }
        };

        repository.GetBetTypes(Arg.Any<GetBetTypesCriteria>())
            .ReturnsForAnyArgs(betTypes);

        // Act
        var result = await service.GetGroupBetTypes(query);

        // Assert
        AssertExtension.Equal(expectedResult.GroupBetTypes, result.GroupBetTypes);
    }

    [Fact]
    public async Task GetGroupBetTypes_BetTypesNotNullOrEmpty_ExpectedValue()
    {
        // Arrange
        var query = new BetTypeQueryModel { MatchId = 1, BetTypes = "1" };
        var betTypes = new BetTypesViewModel { BetTypes = new List<BetTypeModel> { new() } };
        var expectedResult = new GroupBetTypesViewModel
        {
            GroupBetTypes = new List<GroupBetTypeModel> { new() { BetTypes = new List<BetTypeModel> { new() } } }
        };

        repository.GetBetTypes(Arg.Any<GetBetTypesCriteria>())
            .ReturnsForAnyArgs(betTypes);
        repository.GetBetTypesHaveTickets(Arg.Any<BetTypeQueryModel>()).ReturnsForAnyArgs(new List<int> { 1 });
        
        // Act
        var result = await service.GetGroupBetTypes(query);

        // Assert
        AssertExtension.Equal(expectedResult.GroupBetTypes, result.GroupBetTypes);
    }
}