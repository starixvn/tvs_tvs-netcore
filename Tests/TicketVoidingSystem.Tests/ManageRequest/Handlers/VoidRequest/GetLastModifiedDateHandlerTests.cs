using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest
{
    public class GetLastModifiedDateHandlerTests
    {
        [Fact]
        public async Task Handle_RepositoryHasCalled_ReturnViewModelExpected()
        {
            // Arrange
            var request = new GetLastModifiedDateRequest();
            var repository = Substitute.For<IDynamicRepository>();
            var expected = new RequestLastModifiedDate();
            repository.GetAsync<RequestLastModifiedDate>(Arg.Any<GetLastModifiedDateRequest>()).ReturnsForAnyArgs(expected);

            var handler = new GetLastModifiedDateHandler(repository);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            AssertExtension.Equal(expected, actual);
        }
    }
}