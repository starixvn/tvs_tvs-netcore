using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Extensions;
using Fanex.NAP.Core.Business;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest
{
    public class GetRemarkHandlerTests
    {
        // [Theory]
        // //[InlineData(false, false, false, "")]
        // //[InlineData(true, false, false, "You can void Settled or Unsettled tickets")]
        // //[InlineData(true, true, true, "You can void Settled or Unsettled tickets, You can void Instantly Settled")]
        // //[InlineData(false, true, true, "You only void Unsettled tickets, You can void Instantly Settled")]
        // //[InlineData(false, true, false, "You only void Unsettled tickets")]
        // public async void GetRemark_CheckPermission_ReturnRemark(bool settled, bool unsettled, bool instantlySettled, string expected)
        // {
        //     // Arrange
        //     var sessionService = Substitute.For<SessionService>();
        //     sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledParlayBet, Constant.Policy.Host)
        //         .ReturnsForAnyArgs(settled);
        //     sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledParlayBet, Constant.Policy.Host)
        //         .ReturnsForAnyArgs(unsettled);
        //     sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host)
        //     .ReturnsForAnyArgs(instantlySettled);
        //     var handler = new GetRemarkHandler(sessionService);
        //     var listExpected = new List<string>(); 
        //     expected.Split(", ");

        //     // Act
        //     var remark = (List<string>)await handler.Handle(new GetRemarkRequest(), CancellationToken.None);

        //     // Assert
        //     Assert.Equal(listExpected, remark);
        // }
    }
}