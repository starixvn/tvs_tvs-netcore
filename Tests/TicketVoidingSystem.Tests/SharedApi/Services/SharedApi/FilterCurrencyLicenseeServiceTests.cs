using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.SharedApi;

public class FilterCurrencyLicenseeServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly FilterCurrencyLicenseeServiceImp service;

    public FilterCurrencyLicenseeServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new FilterCurrencyLicenseeServiceImp(repository);
    }

    [Fact]
    public async Task GetCurrencies_HasCalledRepository()
    {
        // Arrange
        repository.FetchAsync<Currency>(Arg.Any<GetCurrenciesCriteria>()).Returns([]);

        // Act
        await service.GetCurrencies();

        // Assert
        await repository.Received(1).FetchAsync<Currency>(Arg.Any<GetCurrenciesCriteria>());
    }

    [Fact]
    public async Task GetGroupLicensees_ReturnDataExpected()
    {
        // Arrange
        List<Licensee> licensees = [new() { GroupName = "a", Id = "1" }, new() { GroupName = "b", Id = "2" }, new() { GroupName = "a", Id = "3" }];
        repository.FetchAsync<Licensee>(Arg.Any<GetLicenseesCriteria>()).Returns(licensees);
        List<GroupLicensee> expected =
        [
            new()
            {
                GroupName = "a", Licensees = [new Licensee { GroupName = "a", Id = "1" }, new Licensee { GroupName = "a", Id = "3" }]
            },
            new()
            {
                GroupName = "b", Licensees = [new Licensee { GroupName = "b", Id = "2" }]
            }
        ];

        // Act
        var actual = await service.GetGroupLicensees();

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}