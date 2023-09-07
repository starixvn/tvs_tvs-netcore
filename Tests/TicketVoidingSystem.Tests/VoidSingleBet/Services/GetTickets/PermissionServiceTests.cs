using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.GetTickets;

using Fanex.NAP.Client.Helpers.Business;

public class PermissionServiceTests
{
    [Fact]
    public async Task GetUserPermission_ReturnExpected()
    {
        // Arrange
        var expected = new UserPermission
        {
            SettledTicket = true,
            UnSettledTicket = true,
            InstantlySettledTicket = true
        };
        var sessionService = Substitute.For<SessionService>();
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host)
            .ReturnsForAnyArgs(true);
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host)
            .ReturnsForAnyArgs(true);
        sessionService
            .HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledAndInstantlySettledSingleBet, Constant.Policy.Host)
            .ReturnsForAnyArgs(true);
        var service = new PermissionServiceImp(sessionService);

        // Act
        var actual = await service.GetUserPermission();

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}