using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
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

    [Theory]
    [InlineData(1)]
    [InlineData(0)]
    public async Task GetGroupBetTypes_ResultIsSuccessful_ExpectedValue(int errorCode)
    {
        // Arrange
        var query = new BetTypeQueryModel { MatchId = 1, BetTypes = "" };
        var resultGetBetTypes = new Result { ErrorCode = errorCode };
        var betTypes = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel>
            {
                new() { GroupName = "1", Id = "1" },
                new() { GroupName = "1", Id = "2" },
                new() { GroupName = "2", Id = "3" }
            },
            Result = resultGetBetTypes
        };

        repository.GetBetTypes(Arg.Any<GetBetTypesCriteria>())
            .ReturnsForAnyArgs(betTypes);

        // Act
        var result = await service.GetGroupBetTypes(query);

        // Assert
        AssertExtension.Equal(resultGetBetTypes, result.Result);
    }

    [Fact]
    public async Task GetGroupBetTypes_ResultIsNotSuccessful_ExpectedValue()
    {
        // Arrange
        var query = new BetTypeQueryModel { MatchId = 1, BetTypes = "" };
        var betTypes = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel>
            {
                new() { GroupName = "a", Id = "1" },
                new() { GroupName = "a", Id = "2" },
                new() { GroupName = "b", Id = "3" },
                new() { GroupName = "b", Id = "4" }
            },
            Result = new Result { ErrorCode = 1 }
        };
        var expectedResult = new GroupBetTypesViewModel
        {
            Result = betTypes.Result,
            GroupBetTypes = new List<GroupBetTypeModel>
            {
                new()
                {
                    GroupName = "a", BetTypes = new List<BetTypeModel>
                    {
                        new() { GroupName = "a", Id = "1" },
                        new() { GroupName = "a", Id = "2" }
                    }
                },
                new()
                {
                    GroupName = "b", BetTypes = new List<BetTypeModel>
                    {
                        new() { GroupName = "b", Id = "3" },
                        new() { GroupName = "b", Id = "4" }
                    }
                }
            }
        };

        repository.GetBetTypes(Arg.Any<GetBetTypesCriteria>())
            .ReturnsForAnyArgs(betTypes);

        // Act
        var result = await service.GetGroupBetTypes(query);

        // Assert
        AssertExtension.Equal(expectedResult, result);
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