using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest;

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
        var handler =
            new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

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
        var handler =
            new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

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
        checkPermissionOnRequestService.IsHasPermissionOnRequest(0).ReturnsForAnyArgs(false);
        var request = new SelectRequestsRequest
        {
            RequestId = "123",
            IssueTypeId = "-1",
            SubIssueType = null
        };
        var handler =
            new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

        // Act
        var actualResult = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expectedViewModel, actualResult);
    }

    [Fact]
    public async Task Handler_NotFilterSearchRequestsValid_HasCalledGetRequests()
    {
        // Arrange
        var getRequestService = Substitute.For<GetRequestsService>();
        var renderRequestService = Substitute.For<RenderRequestService>();
        var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
        checkPermissionOnRequestService.IsHasPermissionOnRequest(0).ReturnsForAnyArgs(true);
        var viewModel = new RequestViewModel();
        renderRequestService.Render(Arg.Any<GroupRequestModel>()).ReturnsForAnyArgs(viewModel);
        var models = new List<RequestModel>
        {
            new() { RequestId = 11, SubIssueTypeId = 1 }, new() { RequestId = 11, SubIssueTypeId = 2 },
            new() { RequestId = 12, SubIssueTypeId = 1 }, new() { RequestId = 12, SubIssueTypeId = 1 }
        };
        getRequestService.GetRequests(Arg.Any<SelectRequestsRequest>()).ReturnsForAnyArgs((models, new List<string>()));

        var request = new SelectRequestsRequest
        {
            RequestId = "11",
            IssueTypeId = "1",
            SubIssueType = "1"
        };
        var handler =
            new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

        // Act
        var actualResult = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(actualResult);
        await getRequestService.Received(1).GetRequests(Arg.Any<SelectRequestsRequest>());
    }

    [Fact]
    public async Task Handler_WithInvalidMatchId_ReturnEmptyViewModel()
    {
        // Arrange
        var getRequestService = Substitute.For<GetRequestsService>();
        var renderRequestService = Substitute.For<RenderRequestService>();
        var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
        var expectedViewModel = new List<RequestViewModel>();
        var request = new SelectRequestsRequest
        {
            MatchId = "abc",
            IssueTypeId = "1",
            SubIssueType = "1"
        };
        var handler =
            new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

        // Act
        var actualResult = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expectedViewModel, actualResult);
    }

    [Fact]
    public async Task Handler_WithInvalidRequestId_ReturnEmptyViewModel()
    {
        // Arrange
        var getRequestService = Substitute.For<GetRequestsService>();
        var renderRequestService = Substitute.For<RenderRequestService>();
        var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
        var expectedViewModel = new List<RequestViewModel>();
        var request = new SelectRequestsRequest
        {
            RequestId = "abc",
            IssueTypeId = "1",
            SubIssueType = "1"
        };
        var handler =
            new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

        // Act
        var actualResult = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expectedViewModel, actualResult);
    }

    [Fact]
    public async Task Handler_WithMultipleViewModels_ReturnAllViewModels()
    {
        // Arrange
        var getRequestService = Substitute.For<GetRequestsService>();
        var renderRequestService = Substitute.For<RenderRequestService>();
        var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
        checkPermissionOnRequestService.IsHasPermissionOnRequest(0).ReturnsForAnyArgs(true);

        var viewModel1 = new RequestViewModel { RequestId = 1 };
        var viewModel2 = new RequestViewModel { RequestId = 2 };
        renderRequestService.Render(Arg.Is<GroupRequestModel>(x => x.RequestId == 1)).Returns(viewModel1);
        renderRequestService.Render(Arg.Is<GroupRequestModel>(x => x.RequestId == 2)).Returns(viewModel2);

        var models = new List<RequestModel>
        {
            new() { RequestId = 1, SubIssueTypeId = 1 },
            new() { RequestId = 2, SubIssueTypeId = 1 }
        };
        getRequestService.GetRequests(Arg.Any<SelectRequestsRequest>()).ReturnsForAnyArgs((models, new List<string>()));

        var request = new SelectRequestsRequest
        {
            RequestId = "1",
            IssueTypeId = "1",
            SubIssueType = "1"
        };
        var handler =
            new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

        // Act
        var actualResult = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(2, actualResult.Count());
        Assert.Contains(viewModel1, actualResult);
        Assert.Contains(viewModel2, actualResult);
    }

    [Fact]
    public async Task Handler_WithErrorMessages_ReturnEmptyViewModel()
    {
        // Arrange
        var getRequestService = Substitute.For<GetRequestsService>();
        var renderRequestService = Substitute.For<RenderRequestService>();
        var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
        checkPermissionOnRequestService.IsHasPermissionOnRequest(0).ReturnsForAnyArgs(true);

        var errorMessages = new List<string> { "Error 1", "Error 2" };
        getRequestService.GetRequests(Arg.Any<SelectRequestsRequest>()).ReturnsForAnyArgs((new List<RequestModel>(), errorMessages));

        var request = new SelectRequestsRequest
        {
            RequestId = "1",
            IssueTypeId = "1",
            SubIssueType = "1"
        };
        var handler =
            new SelectRequestsHandler(getRequestService, renderRequestService, checkPermissionOnRequestService);

        // Act
        var actualResult = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Empty(actualResult);
    }
}