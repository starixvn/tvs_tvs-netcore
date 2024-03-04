using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class GetBalanceUpDayHandlerTests
{
    private readonly BalanceUpService balanceUpService;
    private readonly GetBalanceUpDayHandler handler;

    public GetBalanceUpDayHandlerTests()
    {
        balanceUpService = Substitute.For<BalanceUpService>();
        handler = new GetBalanceUpDayHandler(balanceUpService);
    }

    [Fact]
    public async Task Handle_Returns_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetBalanceUpDayRequest();
        var expected = new BalanceUp();
        balanceUpService.GetBalanceUpDay().ReturnsForAnyArgs(expected);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual);
    }
}