using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class CheckValidUsernamesHandlerTests
{
    private readonly GetTransInfoService getTransInfoService;
    private readonly CheckValidUsernamesHandler handler;
    private readonly IDynamicRepository repository;

    public CheckValidUsernamesHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        getTransInfoService = Substitute.For<GetTransInfoService>();
        handler = new CheckValidUsernamesHandler(repository, getTransInfoService);
    }

    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckValidUsernamesRequest();
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>())
            .ReturnsForAnyArgs(new List<string> { "123", "" });
        var validation = new List<CheckUsernamesModel> { new() };
        var transInfoAddRequestModel = new List<TransInfoAddRequestModel>
            { new() { RemoveTransIds = "123", UnMarkTransIds = "123", MarkTransIds = "456" } };
        repository.FetchMultipleAsync<CheckUsernamesModel, TransInfoAddRequestModel, string>(
                Arg.Any<CheckValidUsernamesCriteria>(), CancellationToken.None)
            .ReturnsForAnyArgs((validation, transInfoAddRequestModel, new List<string> { "123" }));


        var viewModel = new CheckValidUsernamesViewModel
        {
            Validation = new CheckUsernamesModel(),
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = "123",
                UnMarkTransIds = "123",
                MarkTransIds = "456",
                TransInfoJson = "123"
            }
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }

    [Fact]
    public async Task Handler_NoHasDataValid_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckValidUsernamesRequest();
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>())
            .ReturnsForAnyArgs(new List<string> { "123", "" });
        var validation = new List<CheckUsernamesModel>();
        var transInfoAddRequestModel = new List<TransInfoAddRequestModel>();
        repository.FetchMultipleAsync<CheckUsernamesModel, TransInfoAddRequestModel, string>(
                Arg.Any<CheckValidUsernamesCriteria>(), CancellationToken.None)
            .ReturnsForAnyArgs((validation, transInfoAddRequestModel, new List<string> { "123" }));


        var viewModel = new CheckValidUsernamesViewModel
        {
            Validation = new CheckUsernamesModel(),
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = null,
                UnMarkTransIds = null,
                MarkTransIds = null,
                TransInfoJson = "123"
            }
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }
}