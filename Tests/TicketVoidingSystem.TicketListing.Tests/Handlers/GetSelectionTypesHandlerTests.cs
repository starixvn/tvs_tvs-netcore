using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.TicketListing.Handlers;
using TicketVoidingSystem.TicketListing.Models;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Handlers;

public class GetSelectionTypesHandlerTests
{
    [Fact]
    public async Task Handler_ReturnListDataFromRepository()
    {
        // Arrange
        var models = new List<SelectionTypeModel>
        {
            new()
        };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<SelectionTypeModel>(default, default).ReturnsForAnyArgs(models);
        var handler = new GetSelectionTypesHandler(repository);

        // Act
        var actual = await handler.Handle(new GetSelectionTypesRequest(), CancellationToken.None);

        // Assert
        Assert.Equal(models, actual);
    }
}