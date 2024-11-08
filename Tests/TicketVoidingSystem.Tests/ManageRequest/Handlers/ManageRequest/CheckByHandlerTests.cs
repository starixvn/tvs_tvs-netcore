using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest;

public class CheckByHandlerTests
{
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Handle_ValidQuery_ExecuteRepository(bool isCheck)
    {
        // Arrange
        var request = new CheckByRequest { RequestId = 1, IsCheck = isCheck };
        var sessionService = Substitute.For<SessionService>();
        var repository = Substitute.For<IDynamicRepository>();
        repository.ExecuteAsync(Arg.Any<EditRequestCommand>()).ReturnsForAnyArgs(1);

        var handler = new CheckByHandler(repository, sessionService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<EditRequestCommand>());
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task Handle_InValidQuery_ReturnException()
    {
        // Arrange
        var sessionService = Substitute.For<SessionService>();
        var repository = Substitute.For<IDynamicRepository>();
        repository.ExecuteAsync(Arg.Any<EditRequestCommand>()).ReturnsForAnyArgs(1);

        var handler = new CheckByHandler(repository, sessionService);

        // Act
        var actual = await handler.Handle(null, CancellationToken.None);

        // Assert
        Assert.Equal(1, actual.ErrorCode);
    }
}