using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class GetLicenseesHandlerTests
{
    [Fact]
    public async Task Handle_RepositoryHasCalled_ReturnListGroupLicensee()
    {
        // Arrange
        var request = new GetGroupLicenseesRequest();
        var groupLicensees = new List<GroupLicensee>
        {
            new ()
            {
                GroupName = "Credit",
                Licensees = new List<Licensee> { new() { Id = "11", Name = "CN88", GroupName = "Credit" } }
            }
        };
        var filterCurrencyLicenseeService = Substitute.For<FilterCurrencyLicenseeService>();
        filterCurrencyLicenseeService.GetGroupLicensees().ReturnsForAnyArgs(groupLicensees);
        var handler = new GetGroupLicenseesHandler(filterCurrencyLicenseeService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        var groupLicensee = actual.FirstOrDefault();
        await filterCurrencyLicenseeService.Received(1).GetGroupLicensees();
        Assert.Equal("Credit", groupLicensee.GroupName);
        Assert.Equal("CN88", groupLicensee.Licensees.First().Name);
    }
}