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

public class CheckTickets14HandlerTests
{
    private readonly GetTransInfoService getTransInfoService;
    private readonly CheckTickets14Handler handler;
    private readonly IDynamicRepository repository;

    public CheckTickets14HandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        getTransInfoService = Substitute.For<GetTransInfoService>();
        handler = new CheckTickets14Handler(repository, getTransInfoService);
    }

    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckTickets14Request();
        var viewModel = new CheckTickets14ViewModel
        {
            InvalidTransIds = "123",
            UnsupportedDateRangeTransIds = "456",
            TransInfoJson = "12"
        };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(new List<string> { "TransInfo", "" });
        repository.GetAsync<CheckTickets14ViewModel>(Arg.Any<CheckTickets14Criteria>()).ReturnsForAnyArgs(viewModel);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(viewModel, actual);
    }
}