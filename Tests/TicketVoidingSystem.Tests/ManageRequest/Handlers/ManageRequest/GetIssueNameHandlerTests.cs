using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest;

public class GetIssueNameHandlerTests
{
    [Fact]
    public async Task Handle_ValidRequest_ReturnIssueInfo()
    {
        var request = new GetIssueNameRequest { SubId = 1 };
        var mapper = Substitute.For<IMapper>();
        var repository = Substitute.For<IDynamicRepository>();
        var issueTypes = new List<IssueType> { new() { IssueTypeId = 1, IssueTypeName = "1234" } };

        repository.FetchAsync<IssueType>(Arg.Any<GetIssueTypeCriteria>()).ReturnsForAnyArgs(issueTypes);
        var handler = new GetIssueNameHandler(mapper, repository);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(model);
    }
}