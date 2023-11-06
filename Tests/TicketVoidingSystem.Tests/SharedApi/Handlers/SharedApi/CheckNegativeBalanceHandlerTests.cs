using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using TicketVoidingSystem.SharedApi.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class CheckNegativeBalanceHandlerTests : IClassFixture<RemotingRefFixture>
{
    private readonly IDynamicRepository repository;
    private readonly CheckNegativeBalanceHandler handler;

    public CheckNegativeBalanceHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new CheckNegativeBalanceHandler(repository);
    }

    [Fact]
    public async Task Handle_HasRequest_HasCalledExpected()
    {
        // Arrange
        var cancellationToken = CancellationToken.None;
        var request = new CheckNegativeBalanceRequest();
        repository.FetchAsync<NegativeBalanceModel>(Arg.Any<CheckNegativeBalanceRequest>(), cancellationToken)
            .Returns(new List<NegativeBalanceModel>());

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await repository.Received().FetchAsync<NegativeBalanceModel>(Arg.Any<CheckNegativeBalanceRequest>(),
            cancellationToken);
    }
}