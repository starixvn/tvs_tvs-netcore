using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Client.Helpers.Business;
using NSubstitute;
using SpecialDelete.VoidByBetId.Handlers;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Handlers;

[Category("VoidByBetId")]
public class GetRemarkHandlerTest
{
    [Fact]
    public async Task Handle_UserHasVoidSettledTicketsPermission_ReturnSettledWarningMessage()
    {
        // Arrange
        var request = new GetRemarkRequest();
        var sessionService = Substitute.For<SessionService>();
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host)
            .Returns(Task.FromResult(true));
        var handler = new GetRemarkHandler(sessionService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Single(result);
        Assert.Contains(StringResource.Warning_Message_VoidBetId, result);
    }

    [Fact]
    public async Task Handle_UserHasVoidUnsettledTicketsPermission_ReturnUnsettledWarningMessage()
    {
        // Arrange
        var request = new GetRemarkRequest();
        var sessionService = Substitute.For<SessionService>();
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host)
            .Returns(Task.FromResult(false));
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host)
            .Returns(Task.FromResult(true));
        var handler = new GetRemarkHandler(sessionService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Single(result);
        Assert.Contains(StringResource.Warning_Message_VoidBetId_UnSettled, result);
    }

    [Fact]
    public async Task Handle_UserHasNoPermission_ReturnEmptyList()
    {
        // Arrange
        var request = new GetRemarkRequest();
        var sessionService = Substitute.For<SessionService>();
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host)
            .Returns(Task.FromResult(false));
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host)
            .Returns(Task.FromResult(false));
        var handler = new GetRemarkHandler(sessionService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Empty(result);
    }
}