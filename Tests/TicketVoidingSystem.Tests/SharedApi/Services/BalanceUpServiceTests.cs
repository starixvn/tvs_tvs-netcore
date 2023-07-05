using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services;
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
        var result = await service.GetBalanceUpDay();

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expected, result);
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
        var result = await service.GetBalanceUpDayZoneManila();

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expected, result);
    }
}