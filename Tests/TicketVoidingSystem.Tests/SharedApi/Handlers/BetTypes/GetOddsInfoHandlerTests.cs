using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.BetTypes;

public class GetOddsInfoHandlerTests
{
    private readonly IDynamicRepository repository;
    private readonly GetOddsInfoHandler handler;

    public GetOddsInfoHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new GetOddsInfoHandler(repository);
    }

    [Fact]
    public async Task Handle_HasRequest_HasCreateGetOddsInfoCriteria()
    {
        // Arrange
        var request = new GetOddsInfoRequest();

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await repository.Received().FetchAsync<OddsInfoViewModel>(Arg.Any<GetOddsInfoCriteria>());
    }
}