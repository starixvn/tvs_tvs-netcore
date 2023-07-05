using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.BetTypes;

public class BetTypesRepositoryTests: AppSettingFixture, IClassFixture<RemotingRefFixture>
{
    private readonly IDynamicRepository repository;
    private readonly BetTypesRepositoryImp service;

    public BetTypesRepositoryTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new BetTypesRepositoryImp(repository);
    }

    [Fact]
    public async Task Get_Return_ListBetTeamNotNull()
    {
        // Arrange
        var betTypes = new List<BetTypeModel> { };
        var criteria = new GetBetTypesCriteria();
        var expected = new BetTypesViewModel
        {
            BetTypes = betTypes,
            Result = new Result
            {
                ErrorCode = criteria.ErrCode,
                ErrorMsg = criteria.ErrMsg
            }
        };

        repository.FetchAsync<BetTypeModel>(default).ReturnsForAnyArgs(betTypes);

        // Act
        var result = service.GetBetTypes(criteria);

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expected, result.Result);
    }

    [Fact]
    public async Task GetBetTypesHaveTickets_MultipleServersExist_ReturnDistinctBetTypes()
    {
        // Arrange
        var query = new BetTypeQueryModel
        {
            MatchId = 123,
            Mode = 1
        };
        repository.FetchAsync<int>(Arg.Is<GetBetTypesHaveTicketsCriteria>(c => c.SiteDbGroupId == 1))
            .Returns(new List<int> { 1, 2, 3 });
        repository.FetchAsync<int>(Arg.Is<GetBetTypesHaveTicketsCriteria>(c => c.SiteDbGroupId == 2))
            .Returns(new List<int> { 3, 4, 5 });

        // Act
        var result = await service.GetBetTypesHaveTickets(query);

        // Assert
        Assert.Equal(new List<int> { 1, 2, 3, 4, 5 }, result);
    }

    [Fact]
    public async Task GetBetTypesHaveTickets_SingleServerExists_ReturnDistinctBetTypes()
    {
        // Arrange
        var query = new BetTypeQueryModel
        {
            MatchId = 456,
            Mode = 1
        };

        repository.FetchAsync<int>(Arg.Is<GetBetTypesHaveTicketsCriteria>(c => c.SiteDbGroupId == 1))
            .Returns(new List<int> { 1, 2, 3 });

        // Act
        var result = await service.GetBetTypesHaveTickets(query);

        // Assert
        Assert.Equal(new List<int> { 1, 2, 3 }, result);
    }

}