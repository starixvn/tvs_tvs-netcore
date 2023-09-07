using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetSubIssueTypeLinkMatchHandlerTests
{
    private readonly GetSubIssueTypeLinkMatchHandler handler;
    private readonly IDynamicRepository repository;

    public GetSubIssueTypeLinkMatchHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new GetSubIssueTypeLinkMatchHandler(repository);
    }

    [Fact]
    public async Task Handler_Successful_HasCallExpected()
    {
        // Arrange
        repository.FetchAsync<SubIssueTypeLinkMatch>(Arg.Any<GetSubIssueTypeLinkMatchRequest>(), CancellationToken.None)
            .ReturnsForAnyArgs(new List<SubIssueTypeLinkMatch>());
        // Act
        _ = await handler.Handle(null, CancellationToken.None);

        // Assert
        await repository.Received(1).FetchAsync<SubIssueTypeLinkMatch>(Arg.Any<GetSubIssueTypeLinkMatchRequest>(),
            CancellationToken.None);
    }
}