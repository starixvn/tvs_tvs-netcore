using System.Threading;
using System.Threading.Tasks;
using Extensions;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class GetRequestHandlerTests
    {
        [Fact]
        public async Task Handle_RepositoryHasCalled_ReturnViewModelExpected()
        {
            // Arrange
            var request = new GetRequestRequest();
            var getRequestService = Substitute.For<GetRequestService>();
            var expected = new RequestDetailViewModel();
            getRequestService.GetRequest(Arg.Any<GetRequestRequest>()).ReturnsForAnyArgs(expected);
            var handler = new GetRequestHandler(getRequestService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            AssertExtension.Equal(expected, actual);
            await getRequestService.Received().GetRequest(Arg.Any<GetRequestRequest>());
        }
    }
}