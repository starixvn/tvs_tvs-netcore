using NSubstitute;
using Xunit;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.BetTypes;

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
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        await repository.Received().FetchAsync<OddsInfoViewModel>(Arg.Any<GetOddsInfoCriteria>(), CancellationToken.None);
    }
}