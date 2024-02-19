using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.Permission;
using TicketVoidingSystem.SharedApi.Handlers.Permission;
using TicketVoidingSystem.SharedApi.Services.Permission;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.Permission;

public class CheckTicketsStatusServiceTests : RemotingRefFixture
{
    [Fact]
    public async Task GetTransInfoJsonForCheckPermission_HasTicketsRequest_ExpectedValue()
    {
        // Arrange
        var request = new CheckTicketsStatusRequest
        {
            Tickets = new List<BetId> { new() { TransId = "1" } },
            CancelCashOutTickets = new List<BetId> { new() { TransId = "2" } }
        };
        const string expected = "1, 2";
        var repository = Substitute.For<IDynamicRepository>();
        repository.GetAsync<string>(Arg.Any<GetTransInfoForCheckVoidPermissionCriteria>()).ReturnsForAnyArgs(expected);

        var service = new CheckTicketsStatusServiceImp(repository);

        // Act
        var result = await service.GetTransInfoJsonForCheckPermission(request);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public async Task GetTransInfoJsonForCheckPermission_NoHasTicketsRequest_ReturnEmpty()
    {
        // Arrange
        var request = new CheckTicketsStatusRequest
        {
            Tickets = null,
            CancelCashOutTickets = null
        };
        var service = new CheckTicketsStatusServiceImp(null);

        // Act
        var result = await service.GetTransInfoJsonForCheckPermission(request);

        // Assert
        Assert.Equal(string.Empty, result);
    }
}