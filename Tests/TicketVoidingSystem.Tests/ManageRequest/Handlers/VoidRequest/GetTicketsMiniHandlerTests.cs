using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest
{
    public class GetTicketsMiniHandlerTests
    {
        [Fact]
        public async Task Handle_ValidRequest_ReturnTicketsViewModel()
        {
            // Arrange
            var request = new GetTicketsMiniRequest();
            var data = new List<GetTicketModel>();
            var getTicketsService = Substitute.For<GetTicketsService>();
            var ticketsViewModelService = Substitute.For<TicketsViewModelService>();
            var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
            checkPermissionOnRequestService.GetVoidPermission().ReturnsForAnyArgs(new VoidPermission());
            var expected = new TicketsViewModel();
            getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);

            var handler = new GetTicketsMiniHandler(getTicketsService, ticketsViewModelService, checkPermissionOnRequestService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // 
            AssertExtension.Equal(expected, actual);
            await getTicketsService.Received().GetTickets(Arg.Any<GetTicketsMiniRequest>());
            await checkPermissionOnRequestService.Received().GetVoidPermission();
            ticketsViewModelService.Received().UpdateViewModel(Arg.Any<TicketsViewModel>(), Arg.Any<IEnumerable<GetTicketModel>>(),
                        default, default, Arg.Any<VoidPermission>());
        }
    }
}