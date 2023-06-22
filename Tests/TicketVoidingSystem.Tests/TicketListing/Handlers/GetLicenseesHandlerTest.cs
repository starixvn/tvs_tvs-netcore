using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.TicketListing.Handlers;
using TicketVoidingSystem.TicketListing.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Handlers;

public class GetLicenseesHandlerTest
{
    [Fact]
    public async Task GetLicensees_HasRequest_ReturnListDataFromRepository()
    {
        // Arrange
        var licensees = new List<Licensee>
        {
            new() { Id = "1", Name = "AAA" },
            new() { Id = "2", Name = "BBB" }
        };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<Licensee>(default, default).ReturnsForAnyArgs(licensees);
        var handler = new GetLicenseesHandler(repository);

        // Act
        var actual = await handler.Handle(new GetLicenseesRequest(), CancellationToken.None);

        // Assert
        Assert.Equal(licensees, actual);
    }
}