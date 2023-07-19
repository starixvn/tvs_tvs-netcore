using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest;

public class GetVoidActionsHandlerTests
{
    [Fact]
    public async Task Handle_RepositoryHasCalled_ReturnViewModelExpected()
    {
        // Arrange
        var request = new GetVoidActionsRequest();
        var repository = Substitute.For<IDynamicRepository>();
        var expected = new List<VoidActionSelection> { new() { Name = "123", Value = "1" } };
        var data = new List<VoidAction> { new() { ActionName = "123", ActionId = "1" } };
        repository.FetchAsync<VoidAction>(Arg.Any<GetVoidActionsRequest>(), CancellationToken.None)
            .ReturnsForAnyArgs(data);
        var handler = new GetVoidActionsHandler(repository);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}