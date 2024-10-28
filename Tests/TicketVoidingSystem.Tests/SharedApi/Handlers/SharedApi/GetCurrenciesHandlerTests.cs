using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class GetCurrenciesHandlerTests
{
    [Fact]
    public async Task Handle_RepositoryHasCalled_ReturnListCurrency()
    {
        // Arrange
        var request = new GetCurrenciesRequest();
        var expected = new List<Currency> { new() { Id = 10002, CurrencyCode = "19" } };
        var filterCurrencyLicenseeService = Substitute.For<FilterCurrencyLicenseeService>();
        filterCurrencyLicenseeService.GetCurrencies().ReturnsForAnyArgs(expected);
        var handler = new GetCurrenciesHandler(filterCurrencyLicenseeService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await filterCurrencyLicenseeService.Received(1).GetCurrencies();
        Assert.Equal(expected, actual);
    }
}