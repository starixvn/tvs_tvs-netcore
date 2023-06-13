using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using System.Collections.Generic;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using Extensions;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

namespace TicketVoidingSystem.SharedApi.Tests.Services.BetTypes;

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
        var expected = new BetTypesViewModel { };

        repository.GetBetTypes(criteria).ReturnsForAnyArgs(expected);

        // Act
        var result = service.GetBetTypes(criteria);

        // Assert
        Assert.NotNull(result);
        await repository.Received().GetBetTypes(criteria);
    }

    [Fact]
    public async Task GetGroupBetTypes_Return_ExpectedValue()
    {
        // Arrange
        var query = new BetTypeQueryModel { MatchId = 1, BetTypes = "" };
        var betTypes = new BetTypesViewModel { BetTypes = new List<BetTypeModel> { new BetTypeModel() } };
        var expectedResult = new GroupBetTypesViewModel
        {
            GroupBetTypes = new List<GroupBetTypeModel> { new GroupBetTypeModel { BetTypes = new List<BetTypeModel> { new BetTypeModel() } } }
        };

        repository.GetBetTypes(Arg.Any<GetBetTypesCriteria>())
            .ReturnsForAnyArgs(betTypes);

        // Act
        var result = await service.GetGroupBetTypes(query);

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expectedResult.GroupBetTypes, result.GroupBetTypes);
    }

    // [Fact]
    // public async Task GetVirtualSports_Return_ExpectedValue()
    // {
    //     // Arrange            

    //     // Act
    //     var result = service.GetVirtualSports();

    //     // Assert
    //     Assert.NotNull(result);
    //     //AssertExtension.Equal(expectedResult.GroupBetTypes, result.GroupBetTypes);
    // }
}