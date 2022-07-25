using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.ABExceptionList.Models;
using Xunit;

namespace TicketVoidingSystem.ABExceptionList.Tests.Handlers
{
    public class GetSubTypeHandlerTests
    {
        [Fact()]
        public async Task Handler_RepositoryHasCalled_ReturnTrue()
        {
            // Arrange
            var request = new GetSubTypeRequest();
            var subTypes = new List<AbExceptionSubTypeViewModel>();
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<AbExceptionSubTypeViewModel>(Arg.Compat.Any<GetSubTypeRequest>(), Arg.Any<CancellationToken>()).ReturnsForAnyArgs(subTypes);
            var handler = new GetSubTypeHandler(repository);

            // Act
            var actualResult = await handler.Handle(request, default);

            // Assert
            await repository.Received(1).FetchAsync<AbExceptionSubTypeViewModel>(Arg.Compat.Any<GetSubTypeRequest>(), Arg.Any<CancellationToken>());
            Assert.Equal(subTypes.Count, actualResult.Count());
        }
    }
}