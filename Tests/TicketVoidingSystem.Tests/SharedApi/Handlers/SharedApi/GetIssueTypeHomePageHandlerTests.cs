using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using TicketVoidingSystem.SharedApi.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class GetIssueTypeHomePageHandlerTests
{
    [Fact]
    public async Task Handle_ReturnsOrderedResults_WhenNotScanArchiveRange()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var request = new GetIssueTypeHomePageRequest { IssueTypeIds = "1,2" };
        var data = new List<IssueTypeHomePageModel>
        {
            new() { IssueTypeId = 2, TotalRequest = 5 },
            new() { IssueTypeId = 1, TotalRequest = 10 }
        };
        repository.FetchAsync<IssueTypeHomePageModel>(Arg.Any<GetTotalRequestByIssueTypeActive>())
            .Returns(callInfo =>
            {
                var active = callInfo.ArgAt<GetTotalRequestByIssueTypeActive>(0);
                active.IsScanArchiveRange = false;
                return data;
            });

        var handler = new GetIssueTypeHomePageHandler(repository);

        // Act
        var result = (await handler.Handle(request, CancellationToken.None)).ToList();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal(1, result[0].IssueTypeId);
        Assert.Equal(2, result[1].IssueTypeId);
    }

    [Fact]
    public async Task Handle_ReturnsCombinedResults_WhenScanArchiveRange()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var request = new GetIssueTypeHomePageRequest { IssueTypeIds = "1,2" };
        var activeData = new List<IssueTypeHomePageModel>
        {
            new() { IssueTypeId = 1, TotalRequest = 10 }
        };
        var archiveData = new List<IssueTypeHomePageModel>
        {
            new() { IssueTypeId = 1, TotalRequest = 5 },
            new() { IssueTypeId = 2, TotalRequest = 7 }
        };
        repository.FetchAsync<IssueTypeHomePageModel>(Arg.Any<GetTotalRequestByIssueTypeActive>())
            .Returns(callInfo =>
            {
                var active = callInfo.ArgAt<GetTotalRequestByIssueTypeActive>(0);
                active.IsScanArchiveRange = true;
                return activeData;
            });
        repository.FetchAsync<IssueTypeHomePageModel>(Arg.Any<GetTotalRequestByIssueTypeArchive>())
            .Returns(archiveData);

        var handler = new GetIssueTypeHomePageHandler(repository);

        // Act
        var result = (await handler.Handle(request, CancellationToken.None)).ToList();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal(1, result[0].IssueTypeId);
        Assert.Equal(15, result[0].TotalRequest);
        Assert.Equal(2, result[1].IssueTypeId);
        Assert.Equal(7, result[1].TotalRequest);
    }

    [Fact]
    public async Task Handle_ReturnsEmptyList_OnException()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<IssueTypeHomePageModel>(Arg.Any<GetTotalRequestByIssueTypeActive>()).Throws(new System.Exception());
        var handler = new GetIssueTypeHomePageHandler(repository);
        var request = new GetIssueTypeHomePageRequest { IssueTypeIds = "1,2" };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Empty(result);
    }
}