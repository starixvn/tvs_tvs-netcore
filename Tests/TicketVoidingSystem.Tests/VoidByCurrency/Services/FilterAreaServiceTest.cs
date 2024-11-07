using System.Threading.Tasks;
using Fanex.NAP.Client.Helpers.Business;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Services;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services;

public class FilterAreaServiceTest
{
    [Fact]
    public async Task GetRemark_HasVoidSettledCurrencyPermission_ReturnSettledRemark()
    {
        // Arrange
        const string expected = "You can void \"Settled\" or \"Unsettled\" tickets.";
        var sessionService = Substitute.For<SessionService>();
        sessionService
            .HasPermission(SpecialDeleteFunctionKeys.VoidSettledCurrencyBet, Constant.Policy.Host)
            .ReturnsForAnyArgs(true);
        var service = new FilterAreaServiceImp(sessionService);

        // Act
        var actual = await service.GetRemark();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetRemark_HasOnlyVoidUnSettledCurrencyPermission_ReturnUnSettledRemark()
    {
        // Arrange
        const string expected = "You can only void \"Unsettled\" tickets.";
        var sessionService = Substitute.For<SessionService>();
        sessionService
            .HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledCurrencyBet, Constant.Policy.Host)
            .Returns(true);
        var service = new FilterAreaServiceImp(sessionService);

        // Act
        var actual = await service.GetRemark();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetRemark_HasNotVoidPermission_ReturnStringEmpty()
    {
        // Arrange
        var expected = string.Empty;
        var sessionService = Substitute.For<SessionService>();
        var service = new FilterAreaServiceImp(sessionService);

        // Act
        var actual = await service.GetRemark();

        // Assert
        Assert.Equal(expected, actual);
    }
}