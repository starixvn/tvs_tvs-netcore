using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using System.Collections.Generic;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using Extensions;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using Fanex.Data.Repository;
using TicketVoidingSystem.SharedApi.Services;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.Extensions;

namespace TicketVoidingSystem.SharedApi.Tests.Services;
public class BalanceUpServiceTests
{
private readonly IDynamicRepository repository;
    private readonly BalanceUpServiceImp service;

    public BalanceUpServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new BalanceUpServiceImp(repository);
    }

    [Fact]
    public async Task GetBalanceUpDay_Return_ExpectedValue()
    {
        // Arrange
        var criteria = new GetBalanceUpDayCriteria();
        var expected = new BalanceUp();
        repository.GetAsync<BalanceUp>(criteria).ReturnsForAnyArgs(expected);

        // Act
        var result = service.GetBalanceUpDay();

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expected, result.Result);
    }

    [Fact]
    public async Task GetBalanceUpDayZoneManila_Return_ExpectedValue()
    {
        // Arrange
        var criteria = new GetBalanceUpDayCriteria();
        var buDay = new BalanceUp();
        var expected = new BalanceUp
        {
            BalanceUpDay = buDay.BalanceUpDay.ZoneManila(),
            MoveBetsDay = buDay.MoveBetsDay.ZoneManila()
        };
        repository.GetAsync<BalanceUp>(criteria).ReturnsForAnyArgs(buDay);

        // Act
        var result = service.GetBalanceUpDayZoneManila();

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expected, result.Result);
    }
}