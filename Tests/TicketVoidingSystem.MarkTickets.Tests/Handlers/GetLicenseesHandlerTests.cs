using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers;
using TicketVoidingSystem.MarkTickets.Models;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Handlers
{
    public class GetLicenseesHandlerTests
    {
        [Fact]
        public async Task Handle_RepositoryHasCalled_ReturnListGroupLicensee()
        {
            // Arrange
            var request = new GetLicenseesRequest();
            var licensees = new List<Licensee> { new() { Id = "11", Name = "CN88", GroupName = "Credit" } };
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<Licensee>(default, default).ReturnsForAnyArgs(licensees);
            var handler = new GetLicenseesHandler(repository);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            var groupLicensee = actual.FirstOrDefault();
            await repository.Received(1).FetchAsync<Licensee>(Arg.Compat.Any<GetLicenseesRequest>(),
                Arg.Compat.Any<CancellationToken>());
            Assert.Equal("Credit", groupLicensee.GroupName);
            Assert.Equal(licensees, groupLicensee.Licensees);
        }
    }
}