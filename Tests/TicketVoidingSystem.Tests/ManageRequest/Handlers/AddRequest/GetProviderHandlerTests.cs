using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetProviderHandlerTests
{
    private readonly GetProviderHandler handler;
    private readonly IDynamicRepository repository;

    public GetProviderHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new GetProviderHandler(repository);
    }

    [Fact]
    public async Task Handler_Successful_ReturnExpected()
    {
        // Arrange
        var request = new GetProviderRequest { MatchId = 1 };
        var provider = new Provider();
        repository.GetAsync<Provider>(Arg.Any<GetProviderCriteria>(), CancellationToken.None)
            .ReturnsForAnyArgs(provider);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(provider, actual);
    }
}