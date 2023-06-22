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

public class BetTypesRepositoryTests
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
}