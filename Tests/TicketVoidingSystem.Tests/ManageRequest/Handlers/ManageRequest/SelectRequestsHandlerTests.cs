using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class SelectRequestsHandlerTests
    {
        [Fact]
        public async Task Handler_WithIssueTypeIdIsNA_OPTION_ReturnEmptyViewModel()
        {
            // Arrange
            var getRequestService = Substitute.For<GetRequestsService>();
            var renderRequestService = Substitute.For<RenderRequestService>();
            var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
            var expectedViewModel = new List<RequestViewModel>();
            var request = new SelectRequestsRequest
            {
                RequestId = "123",
                IssueTypeId = "-1",
                SubIssueType = "3"
            };
            var handler = new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

            // Act
            var actualResult = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.Equal(expectedViewModel, actualResult);
        }

        [Fact]
        public async Task Handler_WithSubIssueTypeIsNull_ReturnEmptyViewModel()
        {
            // Arrange
            var getRequestService = Substitute.For<GetRequestsService>();
            var renderRequestService = Substitute.For<RenderRequestService>();
            var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
            var expectedViewModel = new List<RequestViewModel>();
            var request = new SelectRequestsRequest
            {
                RequestId = "123",
                IssueTypeId = "2",
                SubIssueType = null
            };
            var handler = new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

            // Act
            var actualResult = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.Equal(expectedViewModel, actualResult);
        }

        [Fact]
        public async Task Handler_WithPermissionIsFalse_ReturnEmptyViewModel()
        {
            // Arrange
            var getRequestService = Substitute.For<GetRequestsService>();
            var renderRequestService = Substitute.For<RenderRequestService>();
            var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
            var expectedViewModel = new List<RequestViewModel>();
            checkPermissionOnRequestService.IsHasPermissionOnRequest(default).ReturnsForAnyArgs(false);
            var request = new SelectRequestsRequest
            {
                RequestId = "123",
                IssueTypeId = "-1",
                SubIssueType = null
            };
            var handler = new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

            // Act
            var actualResult = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.Equal(expectedViewModel, actualResult);
        }

        [Fact]
        public async Task Handler_ManageRequestServiceCallRender_ReturnEmptyViewModel()
        {
            // Arrange
            var getRequestService = Substitute.For<GetRequestsService>();
            var renderRequestService = Substitute.For<RenderRequestService>();
            var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
            var expectedViewModel = new List<RequestViewModel>();
            checkPermissionOnRequestService.IsHasPermissionOnRequest(default).ReturnsForAnyArgs(true);
            var viewModel = new RequestViewModel();
            renderRequestService.Render(Arg.Any<GroupRequestModel>()).ReturnsForAnyArgs(viewModel);
            var models = new List<RequestModel> { new RequestModel { RequestId = 11 } };
            getRequestService.GetRequests(Arg.Any<SelectRequestsRequest>()).ReturnsForAnyArgs((models, new List<string>()));

            var expectedViewModels = new List<RequestViewModel> { new RequestViewModel { RequestId = 11 } };
            var request = new SelectRequestsRequest
            {
                RequestId = "11",
                IssueTypeId = "1",
                SubIssueType = "1"
            };
            var handler = new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

            // Act
            var actualResult = await handler.Handle(request, CancellationToken.None);


            // Assert
            await getRequestService.Received().GetRequests(Arg.Any<SelectRequestsRequest>());
            Assert.NotNull(actualResult);
        }
    }
}