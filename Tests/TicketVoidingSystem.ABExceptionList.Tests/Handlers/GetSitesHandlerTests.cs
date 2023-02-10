using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.ABExceptionList.Models;
using Xunit;

namespace TicketVoidingSystem.ABExceptionList.Tests.Handlers;

public class GetSitesHandlerTests
{
    [Fact()]
    public async Task Handler_MediatorSendRequest_ReturnResult()
    {
        // Arrange
        var criteria = new GetSitesCriteria();
        criteria.GetSettingKey();
        criteria.IsValid();
        var sites = new List<LicenseeSite> { new() { SiteName = "188", GroupName = "Deposit", SiteId = "W" } };
        var model = new GroupLicenseeSiteViewModel() { GroupName = "Deposit", Sites = sites };
        var models = new List<GroupLicenseeSiteViewModel> { model };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<LicenseeSite>(Arg.Compat.Any<GetSitesCriteria>(), Arg.Any<CancellationToken>()).ReturnsForAnyArgs(sites);
        var handler = new GetSitesHandler(repository);

        // Act
        var actual = await handler.Handle(new GetSitesRequest(), default);

        // Assert
        await repository.Received(1).FetchAsync<LicenseeSite>(Arg.Compat.Any<GetSitesCriteria>(), Arg.Any<CancellationToken>());
        Assert.Equal(models[0].GroupName, actual.FirstOrDefault().GroupName);
        Assert.Equal(models[0].Sites.Count(), actual.FirstOrDefault().Sites.Count());
    }
}