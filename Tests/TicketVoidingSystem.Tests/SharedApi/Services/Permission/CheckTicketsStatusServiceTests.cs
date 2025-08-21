using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.OnlineServerRepository;
using TicketVoidingSystem.SharedApi.Criteria.Permission;
using TicketVoidingSystem.SharedApi.Handlers.Permission;
using TicketVoidingSystem.SharedApi.Services.Permission;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.Permission;

public class CheckTicketsStatusServiceTests : IClassFixture<AppSettingFixture>
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
        var onlineServerRepos = Substitute.For<OnlineServerRepository>();
        onlineServerRepos.GetOnlineServerIdsModel().ReturnsForAnyArgs(new List<SiteDbGroupModel>
        {
            new() { Id = 1 },
            new() { Id = 2 }
        });
        repository.GetAsync<string>(Arg.Any<GetTransInfoForCheckVoidPermissionCriteria>()).ReturnsForAnyArgs(expected);

        var service = new CheckTicketsStatusServiceImp(repository, onlineServerRepos);

        // Act
        _ = await service.GetTransInfoJsonForCheckPermission(request);

        // Assert
        await onlineServerRepos.Received(1).GetOnlineServerIdsModel();
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
        var onlineServerRepos = Substitute.For<OnlineServerRepository>();
        onlineServerRepos.GetOnlineServerIdsModel().Returns(new List<SiteDbGroupModel>
        {
            new() { Id = 1 },
            new() { Id = 2 }
        });
        var service = new CheckTicketsStatusServiceImp(null, onlineServerRepos);

        // Act
        var result = await service.GetTransInfoJsonForCheckPermission(request);

        // Assert
        Assert.Equal(string.Empty, result);
    }
}