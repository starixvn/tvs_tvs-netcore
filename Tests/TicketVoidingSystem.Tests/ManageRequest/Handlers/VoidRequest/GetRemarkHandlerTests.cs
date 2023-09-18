using System.Threading;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest
{
    using Fanex.NAP.Client.Helpers.Business;

    public class GetRemarkHandlerTests
    {
        [Theory]
        [InlineData(true, false, false, "You can void \"Settled\" or \"Unsettled\" tickets.")]
        [InlineData(true, true, true, "You can void \"Settled\" or \"Unsettled\" tickets., You can void \"Instantly Settled\" tickets settled by Instant Settlement during live time and SABA Time Machine settled tickets.")]
        [InlineData(false, true, true, "You can only void \"Unsettled\" tickets., You can void \"Instantly Settled\" tickets settled by Instant Settlement during live time and SABA Time Machine settled tickets.")]
        [InlineData(false, true, false, "You can only void \"Unsettled\" tickets.")]
        public async void GetRemark_CheckPermission_ReturnRemark(bool settled, bool unsettled, bool instantlySettled, string expected)
        {
            // Arrange
            var sessionService = Substitute.For<SessionService>();
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host)
                .Returns(settled);
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host)
                .Returns(unsettled);
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host)
            .Returns(instantlySettled);
            var handler = new GetRemarkHandler(sessionService);
            var listExpected = expected.Split(", ");

            // Act
            var remark = await handler.Handle(new GetRemarkRequest(), CancellationToken.None);

            // Assert
            Assert.Equal(listExpected, remark);
        }
    }
}