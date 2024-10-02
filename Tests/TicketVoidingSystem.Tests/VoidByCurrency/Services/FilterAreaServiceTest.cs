using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Fanex.NAP.Client.Helpers.Business;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Services;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services;

public class FilterAreaServiceTest
{
    [Fact]
    public async Task GetCurrencies_CallCommonRepository_ReturnCurrencies()
    {
        // Arrange
        var expected = new List<Currency> { new() { Id = 1, CurrencyCode = "Test" } };
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        repository.FetchAsync<Currency>(Arg.Any<GetCurrenciesCriteria>()).ReturnsForAnyArgs(expected);
        var service = new FilterAreaServiceImp(repository, sessionService);

        // Act
        var actual = await service.GetCurrencies();

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task GetLicensees_GetListDataSuccessful_ReturnGroupLicensees()
    {
        // Arrange
        var licensees = new List<Licensee>
        {
            new() { GroupName = "AAA", Id = "1" },
            new() { GroupName = "BBB", Id = "2" },
            new() { GroupName = "AAA", Id = "3" }
        };
        var expected = new List<GroupLicensee>
        {
            new() { GroupName = "AAA", Licensees = new List<Licensee> { licensees[0], licensees[2] } },
            new() { GroupName = "BBB", Licensees = new List<Licensee> { licensees[1] } }
        };

        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        repository.FetchAsync<Licensee>(Arg.Any<GetLicenseesCriteria>()).ReturnsForAnyArgs(licensees);
        var service = new FilterAreaServiceImp(repository, sessionService);

        // Act
        var actual = await service.GetLicensees();

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task GetRemark_HasVoidSettledCurrencyPermission_ReturnSettledRemark()
    {
        // Arrange
        const string expected = "You can void \"Settled\" or \"Unsettled\" tickets.";
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        sessionService
            .HasPermission(SpecialDeleteFunctionKeys.VoidSettledCurrencyBet, Constant.Policy.Host)
            .ReturnsForAnyArgs(true);
        var service = new FilterAreaServiceImp(repository, sessionService);

        // Act
        var actual = await service.GetRemark();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetRemark_HasOnlyVoidUnSettledCurrencyPermission_ReturnUnSettledRemark()
    {
        // Arrange
        const string expected = "You can only void \"Unsettled\" tickets.";
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        sessionService
            .HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledCurrencyBet, Constant.Policy.Host)
            .Returns(true);
        var service = new FilterAreaServiceImp(repository, sessionService);

        // Act
        var actual = await service.GetRemark();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetRemark_HasNotVoidPermission_ReturnStringEmpty()
    {
        // Arrange
        var expected = string.Empty;
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var service = new FilterAreaServiceImp(repository, sessionService);

        // Act
        var actual = await service.GetRemark();

        // Assert
        Assert.Equal(expected, actual);
    }
}