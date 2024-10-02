using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Handlers;

public class GetCurrenciesHandlerTests
{
    [Fact]
    public async Task Handle_RepositoryHasCalled_ReturnListCurrency()
    {
        // Arrange
        var request = new GetCurrenciesRequest();
        var expected = new List<Currency> { new() { Id = 10002, CurrencyCode = "19" } };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<Currency>(default, default).ReturnsForAnyArgs(expected);
        var handler = new GetCurrenciesHandler(repository);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual);
    }
}