
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using TicketVoidingSystem.SharedApi.Services;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using TicketVoidingSystem.SharedApi.Models;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.SharedApi;

public class GetBalanceUpDayZoneManilaHandlerTests
{
    private readonly BalanceUpService balanceUpService;
    private readonly GetBalanceUpDayZoneManilaHandler handler;

    public GetBalanceUpDayZoneManilaHandlerTests()
    {
        balanceUpService = Substitute.For<BalanceUpService>();
        handler = new GetBalanceUpDayZoneManilaHandler(balanceUpService);
    }

    [Fact]
    public async Task Handle_Returns_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetBalanceUpDayZoneManilaRequest();
        var expected = new BalanceUp();
        balanceUpService.GetBalanceUpDayZoneManila().ReturnsForAnyArgs(expected);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual);
    }
}